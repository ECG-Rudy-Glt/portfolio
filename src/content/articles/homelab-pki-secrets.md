---
title: "Construire une PKI interne pour mon homelab"
summary: "Comment mon homelab émet et renouvelle automatiquement ses certificats TLS avec OpenBao et Vault Agent : architecture à deux CA, pourquoi ACME natif a échoué, et les vrais bugs rencontrés en le faisant marcher."
date: 2025-09-12
tags: ["Homelab", "Sécurité", "PKI", "OpenBao", "TLS"]
type: article
---

## Le problème à résoudre

Sur mon [homelab](/projets/homelab/), tous les services internes communiquent en HTTPS -
Traefik, OpenBao, les dashboards de monitoring. Trois options s'offraient à moi pour les
certificats : Let's Encrypt (nécessite un challenge DNS/HTTP public, mal adapté à du `*.home.lab.rudy`
purement interne), des certificats auto-signés par service (`insecureSkipVerify` partout, aucune
chaîne de confiance réelle), ou une autorité de certification interne. J'ai choisi la troisième
option, avec [OpenBao](https://openbao.org/) - le fork open source de HashiCorp Vault.

## Pourquoi une PKI plutôt que des certs auto-signés

- Éviter les `insecureSkipVerify` / `-k` disséminés dans Traefik, Ansible, les outils de
  monitoring - chaque skip-verify est un endroit où un MITM ne serait jamais détecté
- Une seule Root CA à distribuer sur les postes clients (Linux, Windows, mobile), plutôt qu'un
  certificat de confiance par service
- Des certificats **courte durée** (30 jours) renouvelés automatiquement, sans intervention
  manuelle - réduit la fenêtre d'exposition si une clé privée fuit un jour

## L'architecture - deux CA, deux rôles

```
OpenBao (LXC dédié, VLAN TRUST)
├── pki/        Root CA        (10 ans, auto-signée, CN "Homelab Root CA")
└── pki_int/    Intermediate CA (5 ans, signée par la Root)
    ├── rôle "homelab" → *.home.lab.rudy, max_ttl=720h (30j), clés EC-256
    └── rôle "infra"   → *.home.lab.rudy, max_ttl=8760h (1 an)
```

Deux modes d'émission selon la durée de vie voulue : le rôle `infra` (1 an) pour le certificat
d'OpenBao lui-même, régénéré manuellement une fois par an ; le rôle `homelab` (30 jours) pour tout
le reste, renouvelé automatiquement.

Le bootstrap complet (Root CA, Intermediate CA, rôles, policy, AppRole) est scripté et idempotent
- il ne régénère jamais les CA si elles existent déjà, pour ne pas casser une chaîne de confiance
déjà distribuée sur les clients.

## Pourquoi pas ACME natif (le vrai bug)

Ma première tentative a été de brancher le `certificatesResolvers` ACME natif de Traefik
directement sur OpenBao, qui expose un endpoint ACME
([RFC 8555](https://www.rfc-editor.org/rfc/rfc8555)) compatible. Ça a échoué avec une erreur
`Error generating nonce: server did not respond with a proper nonce header`.

J'ai d'abord suspecté un bug OpenBao ([issue #2550](https://github.com/openbao/openbao/issues/2550)
sur leur tracker). En creusant, la vraie cause était ailleurs : OpenBao **masque par défaut** les
en-têtes de réponse HTTP non listés explicitement sur un secret engine, y compris
`Replay-Nonce`, `Link` et `Location` - exigés par le protocole ACME. Le fix est un mount tuning,
pas un correctif de bug :

```bash
bao secrets tune -allowed-response-headers=Location \
                 -allowed-response-headers=Replay-Nonce \
                 -allowed-response-headers=Link \
                 pki_int/
```

Cette étape n'avait simplement pas été faite au moment du bootstrap initial. Plutôt que de refaire
la migration vers ACME après coup, j'ai gardé la solution alternative que j'avais déjà mise en
place et stabilisée entre-temps : **Vault Agent, qui appelle directement l'API PKI**
(`pki_int/issue/homelab`) sans passer par ACME du tout.

## Comment ça marche dans mon infra - le flux Vault Agent

```
vault-agent.service (systemd, sur le LXC Traefik)
    │  auto_auth via AppRole (role_id + secret_id, lus depuis OpenBao KV)
    ▼
OpenBao pki_int/issue/homelab   (TLS vérifié via la Root CA locale - pas de skip-verify)
    │  template Go (bundle.ctmpl) → pkiCert "pki_int/issue/homelab" common_name=*.home.lab.rudy ttl=720h
    ▼
bundle.pem (cert + chaîne + clé, permissions 0640)
    │  déclenche un script à chaque écriture
    ▼
split-bundle.sh → cert.pem (644) + key.pem (600) → redémarre le conteneur Traefik
```

Traefik recharge ensuite via son file provider (`watch: true`) - la coupure de service se limite
au temps du redémarrage du conteneur, pas d'interruption TLS à proprement parler.

**Authentification least-privilege** : l'AppRole `traefik-agent` est lié à une policy qui
n'autorise que la **lecture** sur `pki_int/issue/homelab` - ce service ne peut émettre que ce
type de certificat précis, rien d'autre dans le coffre-fort.

**Cycle de renouvellement** : le certificat a un TTL de 30 jours, Vault Agent le renouvelle à
2/3 de cette durée, donc tous les ~20 jours, sans que j'aie à y penser.

## Les vrais bugs rencontrés en le construisant

- **`tls: {}` autonome rejeté par Traefik v3** (`tls cannot be a standalone element`) - un reste
  de configuration de l'ancienne solution (certificats via `mkcert`) qui n'était plus valide une
  fois la structure de config changée.
- **Deux templates séparés (un pour le cert, un pour la clé) → cert et clé qui ne correspondent
  plus.** Vault Agent décide de renouveler un fichier en inspectant sa destination existante. Avec
  deux templates indépendants, un ancien certificat déjà présent bloquait la réécriture du
  premier pendant que le second émettait une **nouvelle** paire de clés au même instant - cert et
  clé désynchronisés, Traefik en erreur TLS. Le fix : un seul appel `pkiCert` dans un template
  unique, découpé après coup par un script shell plutôt que par deux templates Vault Agent
  indépendants qui ne se coordonnent pas entre eux.
- **Le rôle PKI refuse l'apex nu** (`home.lab.rudy` sans sous-domaine) - seul `*.home.lab.rudy`
  est autorisé par la policy du rôle. Une évidence a posteriori, une source d'échecs silencieux
  avant de le comprendre.

## Distribuer la Root CA aux clients

Chaque type de client a sa propre méthode : import automatique via Ansible et
`update-ca-certificates` pour les machines Linux du lab, import manuel dans le magasin Windows
(`certutil -addstore`) pour mon poste personnel, récupération directe depuis l'endpoint PKI pour
mobile. Pas besoin d'étendre cette distribution à l'usage familial du lab : les services
publics-facing (streaming) utilisent un certificat public classique, cette PKI reste réservée à
l'usage interne/admin.

## Ce que ça change au quotidien

- Plus aucun certificat à renouveler manuellement, sauf celui d'OpenBao lui-même (annuel, seul
  cas non automatisé - Vault Agent ne gère pas son propre certificat)
- Un seul endroit pour révoquer un accès en cas de compromission suspectée
- Surveillance automatique de l'expiration via Blackbox Exporter, avec des alertes à 30 et 7 jours
  avant échéance - la PKI elle-même est monitorée, pas juste déployée et oubliée

## Sources

- [Documentation officielle OpenBao](https://openbao.org/docs/)
- [RFC 8555 - Automatic Certificate Management Environment (ACME)](https://www.rfc-editor.org/rfc/rfc8555)
- [Guide Stéphane Robert - bootstrap Vault](https://blog.stephane-robert.info/docs/homelab/) (base du script d'initialisation, adapté à OpenBao)
