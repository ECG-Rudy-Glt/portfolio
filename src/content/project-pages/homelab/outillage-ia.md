---
project: homelab
title: "Claude Code, le harness du dépôt et l'assistant du lab"
summary: "Ce homelab est construit avec Claude Code, un choix assumé. Depuis novembre, le dépôt a son propre harness (consignes, garde-fous, inventaire, suivi des tâches), et le lab a un assistant IA encadré. Ce que ça change, et les limites que je m'y connais."
order: 9.5
---

## Un choix assumé, pas une facilité cachée

Une bonne partie de ce projet - le code Terraform et Ansible, la documentation technique, le
diagnostic d'incidents, y compris tout le travail de ce site - a été produite avec
[Claude Code](https://claude.com/claude-code) comme assistant de travail. Je le dis explicitement
plutôt que de le passer sous silence : c'est un choix d'outillage, au même titre que choisir
Terraform plutôt qu'un script bash, ou OpenBao plutôt qu'un fichier `.env`.

Ceci dit, ce lab reste un travail personnel énorme - des centaines d'heures de conception, de
décisions, d'erreurs corrigées, d'architecture pensée et repensée, condensées dans un été. L'outil
a changé le rythme auquel ce travail a pu avancer, pas la quantité de réflexion qu'il a demandée.

## Ce que ça a changé concrètement

**Tenir les délais sur tout l'été.** Ce homelab avance en parallèle d'une alternance et d'une
4e année à Supinfo - le temps disponible est contraint. Avoir un assistant capable d'aller vite
sur l'écriture de code répétitif (un nouveau rôle Ansible, une ressource Terraform sur le même
modèle qu'une autre), de creuser une documentation officielle pendant que je réfléchis à
l'architecture, ou de m'aider à diagnostiquer un incident réseau en croisant plusieurs sources en
parallèle, a été le facteur qui a permis de tenir un rythme réaliste sans sacrifier la
profondeur - notamment sur la discipline de tout documenter (voir
[l'Infrastructure as Code](/projets/homelab/iac/) et [les vraies pannes](/projets/homelab/incidents/)),
qui est justement la première chose qu'on abandonne quand le temps manque.

**Rester le décideur, pas le spectateur.** Chaque choix d'architecture documenté sur ce site - les
VLANs, le choix d'OpenBao plutôt qu'Ansible Vault, la manière de traiter un incident - reste une
décision prise et comprise par moi, pas déléguée. L'outil accélère l'exécution et aide à explorer
des pistes ; il ne remplace pas la compréhension de ce qui tourne sur ma propre infrastructure.
C'est une ligne que je tiens sciemment : je ne veux pas être capable de faire fonctionner un
service sans savoir pourquoi il fonctionne.

## Deux endroits où ça a vraiment fait la différence

**Le pentest** (voir [la sécurité](/projets/homelab/securite/)) est l'exemple le plus net. Mener
un test d'intrusion sérieux demande de dérouler méthodiquement des dizaines de vérifications sur
plusieurs surfaces (réseau, applicatif, exposition publique), puis d'interpréter chaque résultat
correctement avant de passer au suivant - le genre de travail où avoir un assistant capable
d'exécuter des commandes, de lire des résultats bruts et de proposer l'étape suivante en
argumentant a permis d'aller nettement plus loin dans le temps disponible, sans sauter d'étapes
de vérification par manque de temps.

**L'Infrastructure as Code** (voir [l'IaC](/projets/homelab/iac/)) en a aussi profité
directement : écrire un nouveau rôle Ansible ou une ressource Terraform sur le même modèle qu'un
service déjà en place est un travail répétitif où l'assistance accélère beaucoup, tout en gardant
la cohérence de style avec le reste du dépôt - un détail qui compte pour que le code reste
lisible et maintenable, pas juste fonctionnel.

## Du simple assistant à un harness

Pendant l'été, Claude Code était un assistant très capable, mais qui repartait de zéro à chaque
session et pouvait refaire une erreur déjà commise. En novembre 2026, le dépôt a reçu son propre
**harness** : l'environnement qui encadre l'agent, pour qu'il travaille vite sans pouvoir casser
ce qui compte.

- **Des consignes écrites, et vérifiées.** Le fichier de consignes du dépôt donne la carte de
  l'infra et dix règles dures : jamais de secret en dur (tout passe par le coffre), jamais
  d'`apply` Terraform sans lire le plan, jamais de push forcé, jamais d'instantané du conteneur
  Jellyfin, rien sur les machines sans mon accord. Ces règles ne reposent pas sur la bonne volonté
  du modèle : une liste d'interdictions dans la configuration et un **hook** qui inspecte chaque
  commande avant exécution les appliquent.
- **La mémoire des pannes, au bon moment.** Quand une commande vise un invité précis, le hook
  joint automatiquement la section « pièges connus » de sa fiche. L'incident de novembre sur le
  conteneur Jellyfin (voir [les vraies pannes](/projets/homelab/incidents/)) est devenu une règle,
  un blocage et un piège documenté, pour que ni moi ni un agent ne le refasse.
- **Un inventaire généré plutôt que décrit.** L'agent lit l'état réel du lab (Proxmox, Terraform,
  Traefik, k3s, Ansible) dans un inventaire produit par un script en lecture seule, au lieu de se
  fier à une documentation qui dérive (voir [l'IaC](/projets/homelab/iac/)).
- **Un suivi qui survit aux sessions.** OpenSpec décrit chaque chantier (le quoi et le pourquoi :
  proposition, conception, tâches), Beads suit qui fait quoi maintenant. Au démarrage de chaque
  session, un hook affiche les tâches prêtes et rappelle les règles dures ; [Relai](/projets/relai/),
  un outil que j'ai écrit, sert à reprendre le fil entre plusieurs dépôts.
- **Des skills pour les gestes répétés** (déployer un playbook, décommissionner un invité, faire
  le tour du lab) et un scan de secrets avant chaque commit.

C'est exactement ce qu'on appelle le *harness engineering*, et c'est devenu un sujet d'étude à
part entière : voir mon [parcours Platform × Harness engineer](/projets/parcours-platform-harness/).

## Hermes, l'assistant du lab et de la maison

Le lab a aussi son propre agent : **Hermes**, un bot Telegram ouvert à la famille, avec des droits
différents selon la personne. Il explique chaque nouvelle alerte (avec les métriques et les pièges connus de
l'invité concerné), prend les demandes de films, pilote quelques appareils de la maison et envoie
chaque lundi une veille technique (nouvelles versions et failles connues des outils du lab).

Le modèle (Claude Haiku) n'est pas le sujet ; l'encadrement l'est :

- **Aucun accès direct.** Le bot ne peut joindre ni Home Assistant ni le reste du lab : une règle
  réseau par compte système l'en empêche. Il passe par un service de politique séparé, qui détient
  les jetons, applique les rôles (admin, foyer, famille) et une liste blanche d'actions.
- **Confirmation hors bande** pour les actions sensibles : le code de confirmation est envoyé par
  le bot à la personne, jamais au modèle, qui ne peut donc pas s'auto-confirmer.
- **Un budget plafonné** : un garde-budget local refuse tout appel au-delà de 1 $ par mois (un
  échange coûte entre 0,001 et 0,003 $), avec des alertes à 80 % et 100 %.
- **Des quotas** sur les demandes de films, et une passe de sécurité dédiée (verrous, limites de
  débit, durcissement du service, droits des fichiers).

La piste initiale d'un LLM **local** a été mesurée puis écartée comme choix par défaut : sur ces
mini-PC sans GPU, une réponse prenait de 1 à 6 minutes. Le modèle local reste installé, pour les
cas où la confidentialité prime sur la latence. Le compromis assumé est un modèle distant, mais
derrière des garde-fous qui ne dépendent pas de lui.

## Ce que je ne maîtrise pas encore en profondeur

Honnêtement : je n'ai pas configuré 100 % de ce lab moi-même, à la main, ligne par ligne. Une
partie a été produite avec l'aide de Claude Code, ce qui veut dire qu'il existe des recoins de
ma propre infrastructure que je ne connais pas avec la même profondeur que ce que j'ai tapé et
décidé moi-même de bout en bout. C'est un vrai angle mort que j'assume plutôt que de prétendre
maîtriser chaque ligne de config au même niveau.

## Rester lucide sur l'usage de l'IA, pas y renoncer

Le travail assisté par IA va continuer à faire partie de ma pratique - le nier serait aussi
malhonnête que de prétendre qu'il n'y a eu aucune assistance sur ce projet. Mais ça n'a de sens
que si les bases de compréhension technique restent solides derrière : savoir lire et challenger
ce qui est produit, savoir reconstruire à la main si l'outil n'est pas disponible, savoir
distinguer une bonne décision d'architecture d'une réponse simplement plausible. L'objectif n'est
pas de choisir entre "tout faire soi-même" et "tout déléguer" - c'est de rester lucide sur lequel
des deux est en train de se passer à chaque instant, et de garder la main sur le premier.
