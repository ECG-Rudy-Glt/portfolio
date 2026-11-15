---
title: "Blogify : un backend de blog 100 % serverless sur AWS"
summary: "Projet 5LAMB (SUPINFO) : une API de blog headless sur Lambda, API Gateway, Cognito, DynamoDB, S3 et CloudFront. L'architecture, le modèle de données en table unique, les flux asynchrones, la sécurité par fonction, le code et l'infrastructure déclarée."
date: 2026-11-15
tags: ["AWS", "Serverless", "SUPINFO", "Projet de groupe", "DynamoDB", "Infrastructure as Code"]
type: article
---

## Le projet

Blogify est un backend de blog **headless** : il n'expose qu'une API REST que n'importe quel front peut consommer. Tout tourne sur des services managés AWS, sans aucun serveur à administrer. Le dépôt contient aussi un petit front de démonstration en HTML et JavaScript, qui sert uniquement à montrer l'API.

**Essayer Blogify** : le front de démonstration est en ligne sur [blogify.gault-rudy.com](https://blogify.gault-rudy.com). On peut y lire les articles, s'inscrire et commenter ; l'écriture demande qu'un administrateur promeuve le compte.

En chiffres : **31 fonctions Lambda** (28 derrière l'API, 3 déclenchées par des événements), **28 routes HTTP**, **une table DynamoDB** et deux index, trois rôles métier (author, editor, admin) plus le lecteur, région `eu-north-1`.

Cet article suit le chemin d'une requête, puis celui des données, puis ce qui se passe en arrière-plan, et finit par le code et l'infrastructure.

## Vue d'ensemble

Trois familles de composants :

- l'**entrée** : API Gateway reçoit tout le trafic de l'API, CloudFront sert les médias ;
- le **calcul** : une Lambda par opération ;
- les **données et événements** : DynamoDB stocke le contenu, S3 les fichiers, et chaque écriture dans DynamoDB produit un événement qui déclenche le travail de fond.

<pre class="mermaid">
flowchart LR
  subgraph C["Clients"]
    WEB["Front de démo web/"]
    API_CLIENT["Bruno, curl, tests e2e"]
  end
  subgraph E["Entrée"]
    APIGW["API Gateway REST /v1<br/>clé d'API + usage plan<br/>authorizer Cognito"]
    CF["CloudFront<br/>médias"]
  end
  COG["Cognito User Pool<br/>groupes admin, editor, author"]
  subgraph L["Lambda Node.js 22 arm64"]
    HTTP["28 fonctions HTTP"]
    PM["processMedia"]
    IDX["indexPost"]
    NOT["notifySubscribers"]
  end
  subgraph D["Données"]
    DDB[("DynamoDB blogify-dev<br/>GSI1, GSI2, Streams")]
    IDEM[("Table idempotence")]
    S3[("S3 privé<br/>uploads/")]
  end
  SNS(["SNS new-post"])
  DLQ[["SQS DLQ"]]
  MAIL["Abonnés email"]

  WEB --> APIGW
  API_CLIENT --> APIGW
  WEB -->|"GET image"| CF
  WEB -->|"POST pré-signé"| S3
  APIGW -->|"vérifie le JWT"| COG
  APIGW --> HTTP
  HTTP --> DDB
  HTTP --> IDEM
  HTTP --> COG
  HTTP -->|"signe l'URL"| S3
  HTTP -->|"Subscribe"| SNS
  CF -->|"OAC"| S3
  S3 -->|"ObjectCreated"| PM
  PM --> DDB
  DDB -->|"Stream"| IDX
  DDB -->|"Stream"| NOT
  IDX --> DDB
  NOT --> SNS
  SNS --> MAIL
  PM -.->|"échec"| DLQ
  IDX -.->|"échec"| DLQ
  NOT -.->|"échec"| DLQ
</pre>

Le principe à retenir : **l'API ne fait que le travail synchrone** (valider, écrire, répondre). Tout ce qui peut attendre (vérifier un fichier, indexer pour la recherche, envoyer des emails) est déclenché par un événement. L'API reste rapide et n'est pas exposée aux pannes de ces traitements.

## La vie d'une requête

Exemple : un auteur crée un brouillon avec `POST /v1/posts`. La requête passe une série de filtres, et plus un refus arrive tôt, moins il coûte : les premiers refus se font dans API Gateway, sans démarrer de Lambda.

<pre class="mermaid">
sequenceDiagram
  autonumber
  actor A as Auteur
  participant G as API Gateway
  participant C as Cognito
  participant L as Lambda createPost
  participant D as DynamoDB
  A->>G: POST /v1/posts + X-Api-Key + Bearer idToken
  G->>G: clé d'API connue ? sinon 403
  G->>G: débit sous 50 req/s, pic 100 ? sinon 429
  G->>C: signature et expiration du JWT
  C-->>G: valide, claims sub, email, groupes
  G->>L: invoque avec les claims
  L->>L: httpHandler : rôle author+ ? sinon 403
  L->>L: corps JSON valide selon Zod ? sinon 400
  L->>L: Idempotency-Key déjà vue ? rejoue la réponse
  L->>D: transaction : article + réservation du slug
  D-->>L: OK ou slug pris
  L-->>A: 201 Created + Location + X-Correlation-Id
</pre>

| Code | Produit par | Quand |
| --- | --- | --- |
| 403 | API Gateway | En-tête `X-Api-Key` absent ou inconnu |
| 429 | API Gateway | Usage plan dépassé : 50 req/s en continu, 100 en pic, 100 000 requêtes par mois et par clé |
| 401 | Authorizer Cognito | Jeton absent, mal signé ou expiré (1 h) |
| 404 | API Gateway | Route inconnue |
| 403 | Lambda | Connecté, mais sans le rôle requis ou pas propriétaire |
| 400 | Lambda (Zod) | Corps ou paramètres invalides, avec la liste des champs |
| 404 | Lambda | Ressource introuvable ou invisible pour vous |
| 409 | Lambda (DynamoDB) | Version périmée, transition interdite, modération concurrente |
| 422 | Lambda (idempotence) | Même `Idempotency-Key` avec un corps différent |

Toutes les erreurs, qu'elles viennent d'API Gateway ou de Lambda, ont le même format : **RFC 9457 Problem Details**. Un client n'a qu'un seul format d'erreur à gérer.

## Le modèle de données : une seule table

Tout le contenu vit dans **une table DynamoDB** (*single-table design*). Chaque élément a une clé de partition `PK` et une clé de tri `SK` ; le préfixe de la clé dit de quel type d'entité il s'agit. Deux index secondaires donnent deux autres façons de retrouver les éléments.

La méthode : lister d'abord les 12 questions que l'application pose à la base (« les articles publiés les plus récents », « les commentaires en attente »…), puis choisir les clés pour que chacune soit une lecture directe (`GetItem` ou `Query`). Il n'y a **aucun `Scan`** : le coût et la latence d'une requête ne dépendent pas de la taille de la table.

| Entité | PK | SK | GSI1 (par statut) | GSI2 (par auteur) |
| --- | --- | --- | --- | --- |
| Article | `POST#<id>` | `META` | `STATUS#<statut>` / date#id | `AUTHOR#<auteur>` / `POST#<date>` |
| Slug | `SLUG#<slug>` | `SLUG` | | |
| Commentaire | `POST#<id>` | `COMMENT#<id>` | `COMMENT#<statut>` / date#id | `AUTHOR#<auteur>` / `COMMENT#<date>` |
| Média | `MEDIA#<id>` | `META` | | `AUTHOR#<auteur>` / `MEDIA#<date>` |
| Index tag | `TAG#<tag>` | date#id | | |
| Index mot | `TERM#<mot>` | date#id | | |
| Notification envoyée | `NOTIF#<id>` | `SENT` | | |

Pourquoi ces clés :

- les commentaires vivent **sous leur article** (même `PK`) : une seule requête les liste ;
- GSI1 range par statut : « publiés récents », « en relecture » et « commentaires en attente » sont trois lectures du même index ;
- GSI2 range par auteur : « mes articles » et « mes médias » se distinguent par le préfixe de la `SK` ;
- les identifiants sont des **ULID**, uniques et triés par date de création.

Garanties d'écriture :

- **slug unique** : l'article et l'élément `SLUG#` sont écrits dans une même transaction, conditionnée à l'absence du slug ;
- **verrou optimiste** : chaque article a un champ `version`, et une modification n'aboutit que si la version n'a pas changé depuis la lecture, sinon 409 ;
- **compteur de commentaires** mis à jour dans la même transaction que la modération.

La table a aussi les Streams activés, la restauration à la seconde près (PITR) et une expiration automatique (TTL). Une seconde table garde pendant une heure les réponses des POST pour l'idempotence.

## Le cycle de vie d'un article

C'est la règle métier centrale, et ce qui distingue les rôles. Un *guest author* rédige, mais ne publie jamais seul : il soumet son brouillon en relecture, et un editor ou un admin décide.

<pre class="mermaid">
stateDiagram-v2
  [*] --> draft : POST /posts (author+)
  draft --> in_review : l'auteur soumet
  in_review --> draft : editor renvoie
  in_review --> published : editor publie
  draft --> published : editor publie directement
  published --> archived : editor archive
  archived --> published : editor republie
  draft --> [*] : DELETE (auteur ou editor)
</pre>

| Action | Lecteur | Author | Editor | Admin |
| --- | --- | --- | --- | --- |
| Lire les articles publiés, rechercher | oui | oui | oui | oui |
| Créer un article, uploader un média | | oui | oui | oui |
| Modifier un article | | les siens, non publiés | tous | tous |
| Publier, archiver, renvoyer en brouillon | | | oui | oui |
| Supprimer un article | | ses brouillons | tous | tous |
| Commenter | oui | oui | oui | oui |
| Modérer les commentaires | | | oui | oui |
| Gérer les rôles des utilisateurs | | | | oui |

Le lecteur est un compte inscrit sans groupe Cognito. Une inscription ne donne jamais de rôle : seul un admin promeut un compte.

## Les flux asynchrones

### Upload d'un média

Le fichier ne passe **jamais par Lambda**. API Gateway limite le corps d'une requête à 10 Mo et Lambda à 6 Mo, ce qui rendrait les vidéos impossibles. L'API signe une autorisation d'envoi, et le navigateur envoie le fichier directement à S3.

<pre class="mermaid">
sequenceDiagram
  autonumber
  actor A as Auteur
  participant L as createMedia
  participant D as DynamoDB
  participant S as S3
  participant P as processMedia
  participant F as CloudFront
  A->>L: POST /v1/media fileName, contentType, size
  L->>D: média status = pending
  L-->>A: 201 + URL pré-signée POST (5 min, type et taille imposés)
  A->>S: envoi direct du fichier
  S--)P: événement ObjectCreated sur uploads/
  P->>S: lit les 16 premiers octets
  alt type réel conforme et taille OK
    P->>D: status = ready + URL CloudFront
  else non conforme
    P->>S: supprime le fichier
    P->>D: status = rejected
  end
  A->>F: GET image (cache en edge)
</pre>

`processMedia` vérifie les **magic bytes** (la signature binaire en tête du fichier) : un exécutable renommé en `.jpg` est rejeté, quel que soit le type annoncé.

### Publication : indexation et notification

Quand un editor publie, l'API écrit seulement le nouveau statut. DynamoDB Streams transmet ce changement à deux fonctions indépendantes, et des filtres sur les déclencheurs évitent de les réveiller pour rien.

<pre class="mermaid">
flowchart LR
  P["PATCH /posts/id/status<br/>published"] --> D[("DynamoDB")]
  D -->|"filtre : PK POST# et SK META"| I["indexPost"]
  D -->|"filtre : nouveau statut published"| N["notifySubscribers"]
  I -->|"écrit TAG# et TERM#<br/>efface les anciennes entrées"| D
  N -->|"réserve NOTIF#id<br/>écriture conditionnelle"| D
  N -->|"une seule fois par article"| S(["SNS"])
  S --> M["emails des abonnés"]
</pre>

- **Pas de boucle** : les entrées écrites par `indexPost` produisent elles aussi des événements, mais le filtre ne laisse passer que les articles. L'indexeur ne se redéclenche jamais lui-même.
- **Pas d'email en double** : un Stream peut rejouer un événement. Avant d'envoyer, `notifySubscribers` écrit `NOTIF#<id>` à condition qu'il n'existe pas. Un rejeu trouve l'élément et n'envoie rien.

### Gestion des échecs

| Fonction | Déclencheur | En cas d'erreur |
| --- | --- | --- |
| Les 28 fonctions HTTP | API Gateway, synchrone | Erreur renvoyée au client au format RFC 9457 |
| `processMedia` | S3, asynchrone | 2 nouvelles tentatives, puis message dans la DLQ |
| `indexPost`, `notifySubscribers` | Streams, lots de 10 | 3 tentatives, lot coupé en deux pour isoler l'élément fautif, seuls les éléments en échec rejoués, puis DLQ |

La DLQ (SQS, 14 jours de rétention) déclenche une alarme CloudWatch dès qu'un message y arrive. Dans un système asynchrone l'erreur ne remonte à personne : c'est la DLQ et son alarme qui la rendent visible.

## La sécurité, couche par couche

| Couche | Mesure | Ce qu'elle empêche |
| --- | --- | --- |
| Application cliente | Clé d'API par application et usage plan | Un client inconnu, ou qui sature l'API |
| Identité | Cognito : mot de passe de 12 caractères, email vérifié, jetons d'une heure, messages qui ne révèlent pas si un compte existe | Usurpation, énumération des comptes |
| Rôle | Groupes Cognito lus dans le jeton, matrice de permissions dans le code | Un author qui publie, un editor qui change des rôles |
| Propriété | Vérifiée dans le code | Modifier le contenu d'un autre |
| Discrétion | 404 et non 403 sur un article que vous ne pouvez pas voir | Deviner l'existence d'un brouillon |
| Entrées | Validation Zod stricte, tailles maximales | Données malformées, éléments trop gros pour DynamoDB |
| IAM | **Un rôle par fonction**, limité aux actions et ressources utiles | Qu'une fonction compromise touche au reste |
| Fichiers | Bucket privé, lecture seulement via CloudFront (OAC), HTTPS obligatoire, URL pré-signée de 5 min, magic bytes | Fichiers publics par erreur, faux types |
| Données personnelles | Emails des abonnés gérés par SNS (double confirmation), nom public jamais tiré de l'email | Fuite d'adresses |

### L'IAM en pratique

`provider.iam.role.mode: perFunction` demande à Serverless v4 de créer un rôle IAM distinct pour chacune des 31 fonctions. Chaque rôle est assemblé à partir d'un catalogue de permissions élémentaires nommées avec des ancres YAML :

```yaml
custom:
  iam:
    queryGsi1: &queryGsi1
      Effect: Allow
      Action: [dynamodb:Query]
      Resource: !Join ['', [!GetAtt BlogTable.Arn, '/index/GSI1']]

functions:
  reviewQueue:
    iam: { role: { statements: [*queryGsi1] } }   # ne peut que lire GSI1
```

Quelques subtilités que le projet m'a apprises :

- aucune fonction n'a `dynamodb:TransactWriteItems` : DynamoDB vérifie une transaction **élément par élément**, `PutItem` suffit ;
- `createMedia` a `s3:PutObject` alors qu'elle n'envoie rien : une URL pré-signée porte la signature de la fonction, et S3 vérifie que **le signataire** avait le droit d'écrire ;
- `processMedia`, `indexPost` et `notifySubscribers` ont `sqs:SendMessage` : la destination « en cas d'échec » est envoyée avec le rôle de la fonction ;
- chaque index DynamoDB a son propre ARN, donc `reviewQueue` lit GSI1 sans pouvoir lire la table ;
- les conditions `SourceArn` et `SourceAccount` sur les politiques de ressource évitent le problème du « confused deputy ».

## Les briques AWS, une par une

| Service | Rôle dans Blogify | À retenir |
| --- | --- | --- |
| **API Gateway** (REST) | 28 routes sous `/v1`, authorizer Cognito, clés d'API et usage plan, erreurs au format RFC 9457 | Trois refus sur quatre se font ici, sans démarrer de Lambda. REST plutôt que HTTP API pour l'authorizer natif, les usage plans et le cache |
| **Cognito** | Comptes, jetons JWT, rôles sous forme de groupes | Aucun mot de passe stocké chez nous. Le groupe est dans le jeton : aucune lecture en base pour autoriser |
| **CloudFront** | Diffusion des médias, seul lecteur du bucket via OAC | Les lectures de médias ne touchent ni Lambda ni l'API |
| **Lambda** | 31 fonctions, Node.js 22, arm64, 512 Mo | Une fonction par opération : rôle IAM, mémoire, métriques et logs propres |
| **DynamoDB** | Table unique, 2 index, Streams, PITR, TTL, facturation à la demande | Les clés viennent des questions posées à la base, pas des entités |
| **S3** | Fichiers médias, upload direct par URL pré-signée | Accès public bloqué, chiffrement, HTTPS obligatoire |
| **DynamoDB Streams** | Fil des changements, lu par `indexPost` et `notifySubscribers` | Chorégraphie : l'API ignore qu'il existe une recherche ou des emails |
| **SNS** | Emails aux abonnés (double opt-in), alertes | Nous ne stockons aucune adresse |
| **SQS (DLQ)** | Événements en échec, 14 jours | Rien n'est perdu, tout peut être rejoué |
| **CloudWatch, X-Ray** | Logs JSON, 8 métriques métier, 5 alarmes, dashboard, traces | Un correlation ID dans chaque log et une trace par requête |
| **Powertools** | Logger, Tracer, Metrics, Idempotency | Un client qui renvoie sa requête après une coupure ne crée pas deux articles |
| **Serverless Framework v4** | Toute l'infrastructure décrite dans le code | Le même code crée `dev` ou `prod`, rien n'est configuré à la main |

## Le code

Une règle de dépendance simple : un handler appelle le domaine et les repositories, et le domaine ne connaît pas AWS. Toutes les règles métier se testent sans rien simuler.

<pre class="mermaid">
flowchart TB
  F["functions/<br/>1 fichier = 1 Lambda, quelques lignes"]
  S["services/<br/>auth (Cognito), posts (lecture avec droits)"]
  DOM["domain/<br/>règles pures : permissions, statuts,<br/>slug, recherche, types de fichiers"]
  R["repositories/<br/>DynamoDB : posts, comments,<br/>media, search, dynamo"]
  LIB["lib/<br/>httpHandler, erreurs, auth,<br/>validation, pagination, idempotence"]
  SCH["schemas/<br/>Zod : validation + OpenAPI"]
  F --> S
  F --> DOM
  F --> R
  F --> LIB
  F --> SCH
  S --> DOM
  S --> R
  R --> LIB
</pre>

Les 28 fonctions HTTP sont construites avec une enveloppe commune, `httpHandler`, qui fait le travail transversal : correlation ID, contrôle d'accès, parsing et validation Zod, idempotence, conversion de toute erreur en Problem Details. Un handler type tient en quelques lignes :

```ts
export const handler = httpHandler(
  { access: AUTHORS, body: CreatePostBody, idempotent: 'createPost' },
  async ({ body, user }) => {
    const post = await createPost(
      newPost({
        ...body,
        postId: ulid(),
        author: { id: user.id, name: user.name },
        now: new Date().toISOString(),
      }),
    );
    countMetric('PostCreated');
    return { statusCode: 201, headers: { Location: `/v1/posts/${post.postId}` }, body: post };
  },
);
```

Une règle revient partout : **404 quand vous ne pouvez pas voir la ressource, 403 quand vous la voyez mais ne pouvez pas agir dessus**. Un brouillon d'un autre auteur répond 404 : on ne révèle pas son existence.

Les schémas Zod servent trois fois : validation à l'exécution, type TypeScript du handler, et documentation. Un script génère `openapi.json` (OpenAPI 3.1) à partir de ces schémas, et la CI échoue si le fichier n'est pas à jour : la documentation ne peut pas dériver du code.

## L'infrastructure et les tests

`serverless.yml` déclare les fonctions, leurs déclencheurs et leurs permissions ; `resources/*.yml` décrit en CloudFormation la table, le bucket, CloudFront, Cognito, les réponses d'API Gateway, SNS, SQS, les alarmes et le dashboard. Une commande déploie toute la stack, une autre la supprime.

| Niveau | Ce qui est testé | Où |
| --- | --- | --- |
| Unitaire | Permissions, transitions, slug, tokenisation, magic bytes, enveloppe HTTP, schémas | CI, à chaque PR |
| Intégration | Repositories et handlers contre une vraie DynamoDB locale : clés, index, transactions, conditions, idempotence | CI (DynamoDB Local en service Docker) |
| End-to-end | Les 4 parcours sur le stage déployé (author, editor, lecteur, admin) et les erreurs 401, 403, 404, 429 | Après un déploiement |

La CI GitHub Actions a deux jobs : `check` (lint, format, types, OpenAPI à jour, tests unitaires avec seuil de couverture) et `integration`.

## Limites assumées et pistes

Ce qui reste imparfait, et que je préfère dire :

- la recherche est un index inversé maison : pas de tolérance aux fautes ni de score fin ;
- `POST /v1/subscriptions` est public : on peut abonner l'adresse de quelqu'un d'autre (qui reçoit un email de confirmation) ;
- un média reste servi par CloudFront jusqu'à 24 h après sa suppression ;
- si la suppression des commentaires échoue après celle de l'article, des commentaires orphelins restent.

Pour passer à l'échelle : répartir la partition chaude `STATUS#published` (write sharding), mettre un cache devant les lectures publiques, brancher OpenSearch Serverless sur le même Stream pour la recherche, passer par SNS → SQS → SES pour les gros volumes d'emails, et envisager HTTP API (environ 70 % moins cher) si le cache et les usage plans ne servent plus.
