---
project: ops-delivery-suite
title: "Traefik Edge Proxy"
summary: "Un reverse proxy qui obtient et renouvelle seul les certificats Let's Encrypt, avec en-têtes de sécurité et déploiement Ansible."
order: 7
---

## À quoi ça sert

Exposer plusieurs applications sur un même serveur, chacune sur son domaine et en HTTPS, sans gérer de certificats à la main. Traefik lit les labels des conteneurs Docker et crée les routes et les certificats au fil de l'eau.

## Ce qui est inclus

- Redirection HTTP vers HTTPS (301), certificats Let's Encrypt (challenge HTTP, ou DNS pour les wildcards)
- Middlewares prêts à l'emploi : en-têtes de sécurité (HSTS, `X-Frame-Options`, `nosniff`…), compression, limitation de débit, liste d'IP autorisées, CORS
- Dashboard servi en HTTPS uniquement, derrière un mot de passe bcrypt
- `ansible/deploy_traefik.yml` : prépare le serveur (IP forwarding, ports UFW, Docker si absent, compatible avec un serveur durci par [VPS Shield](/projets/ops-delivery-suite/vps-shield/)) puis déploie et vérifie la stack

## Utilisation

```bash
cd traefik-edge-proxy
make setup && cp .env.example .env
make password            # copier DASHBOARD_USERS='...' dans .env, régler DASHBOARD_DOMAIN
make start
```

Exposer une application :

```yaml
labels:
  - traefik.enable=true
  - traefik.http.routers.app.rule=Host(`app.example.com`)
  - traefik.http.routers.app.tls.certresolver=letsencrypt
  - traefik.http.routers.app.middlewares=secure-chain@file
```

## Ce que j'ai corrigé avant publication

Cet outil fusionne deux anciens dépôts, Automate HTTPS (la doc et la configuration) et Traefik Edge Proxy (le déploiement Ansible). En le démarrant réellement :

- **Aucune route ne fonctionnait avec un Docker récent.** Traefik v3.0 et v3.2 parlent une version de l'API Docker que Docker 29 refuse (`client version 1.24 is too old`) : le provider ne voyait aucun conteneur. Passage à Traefik v3.6.
- **Les en-têtes de sécurité n'étaient jamais appliqués.** Un champ inexistant (`frameDelay` au lieu de `frameDeny`) faisait rejeter tout le fichier de middlewares par Traefik. Après correction, HSTS, `X-Frame-Options` et `nosniff` sont bien présents.
- **Identifiants par défaut.** Le dashboard était protégé par `admin:admin` et un middleware de test par `test:test`. Il n'y a plus de valeur par défaut : sans `DASHBOARD_USERS`, la stack refuse de démarrer.
- **Port mort.** Le dashboard était annoncé sur le port 8080, que Traefik ne servait pas (mode `insecure` désactivé) ; le playbook attendait ce port et restait bloqué.
- **SELinux.** Le playbook passait SELinux en mode permissif, ce qui n'a pas sa place dans une suite de durcissement : retiré.
- Le générateur de mot de passe doublait les `$` aussi pour `middlewares.yml`, où ils ne doivent pas l'être.

[Voir le code sur GitHub](https://github.com/ECG-Rudy-Glt/ops-delivery-suite/tree/main/traefik-edge-proxy)
