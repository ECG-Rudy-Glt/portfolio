---
title: "Construire un Netflix familial self-hosted avec Jellyfin"
summary: "Comment j'ai monté un service de streaming façon Netflix pour une dizaine de proches sur mon homelab - choix des technos, architecture zéro stockage local via debrid, sécurisation d'une exposition publique, et les vrais incidents rencontrés en prod."
date: 2026-07-21
tags: ["Homelab", "Streaming", "Jellyfin", "Sécurité", "Self-hosting"]
type: article
---

<div style="display:inline-block; background:#f3efe4; padding:1rem 1.5rem; border-radius:0.75rem;">
  <img src="/logos/jellyfin.svg" alt="Logo Jellyfin" style="width:220px; height:auto; display:block; margin:0;" />
</div>

## Le besoin

Sur mon [homelab](/projets/homelab/), je voulais offrir à une dizaine de proches (famille, amis) une expérience de streaming façon Netflix - un catalogue, une recherche, "je clique et ça joue" - sans gérer moi-même des To de disques, et sans jamais exposer autre chose que le strict nécessaire sur Internet. Ça a donné une stack complète : Jellyfin comme media server, un pipeline debrid pour le contenu, et une exposition publique durcie et testée en conditions réelles - pas juste supposée sûre.

Cet article raconte le cheminement et les choix. Pour le détail technique le plus à jour (chaîne complète, choix du client Streamyfin pour le cast, résultats du pentest), voir la [page dédiée du projet](/projets/homelab/jellyfin/).

## Jellyfin plutôt qu'Emby ou Plex

Jellyfin et Emby partagent la même base de code historique (Jellyfin est un fork communautaire d'Emby créé en 2018 quand celui-ci est passé propriétaire) ; Plex vient d'une lignée différente (issu de XBMC/Kodi côté serveur), mais pose le même problème de fond : un modèle payant sur exactement les fonctions dont j'avais besoin.

| Critère | ![Jellyfin](/logos/jellyfin-icon.svg) Jellyfin | ![Emby](/logos/emby.svg) Emby | ![Plex](/logos/plex.svg) Plex |
|---|---|---|---|
| Licence | Open source (GPL-2.0) | Propriétaire depuis 2018 | Propriétaire |
| Hardware transcoding | Gratuit (QuickSync/NVENC) | Payant (Premiere, ~5 €/mois ou ~120 € lifetime) | Payant (Plex Pass) |
| Accès distant | Gratuit (à gérer soi-même) | Gratuit | Payant depuis peu (Plex Pass, ou Remote Watch Pass ~3 €/mois par spectateur) |
| Prix de l'abonnement premium | - | ~120 € lifetime | Passé de ~250 € à ~750 € lifetime en juillet 2026 |
| Utilisateurs multiples | Illimité, gratuit | Illimité, gratuit | Illimité, gratuit |
| Télémétrie serveur | Aucune | Oui | Oui (compte plex.tv requis) |
| Écosystème clients | Bon (communautaire pour Apple TV) | Bon | Le plus large du marché (quasi tous les boîtiers TV) |
| SSO / OIDC | Plugin natif | Plugin (Premiere) | Non |

Plex a un vrai atout : c'est objectivement l'écosystème de clients le plus large et le plus poli du marché. Mais pour un déploiement familial où je paie déjà l'abonnement debrid, ajouter un second abonnement juste pour débloquer le transcodage matériel et l'accès distant - des fonctions gratuites ailleurs - n'avait pas de sens, surtout après la hausse de prix de juillet 2026 (le lifetime a triplé). Le hardware transcoding gratuit de Jellyfin est le critère décisif : avec plusieurs flux 4K potentiels côté famille, payer pour décharger le CPU n'avait pas de sens. Zéro télémétrie et zéro compte cloud obligatoire ont fini de trancher.

## Zéro disque : le pari du debrid

L'idée vient de mon propre usage avant ce projet : j'utilisais déjà Stremio avec un debrideur pour moi-même, et l'évidence s'est imposée assez vite - garder des films en dur sur un disque qui prend de la place, alors qu'un service cloud peut stocker et streamer à la demande pour quelques dizaines d'euros par an, n'avait plus vraiment de sens. J'ai repris exactement ce principe pour la version familiale : plutôt que d'investir dans plusieurs To de stockage, toute la bibliothèque vit dans le cloud d'un service de "debrid" : je demande un film, le service le télécharge dans son propre cloud, et je le re-stream vers la famille sans qu'un seul octet ne touche mes disques.

Bénéfice secondaire, pas négligeable : c'est l'infrastructure du debrideur qui échange directement avec les autres utilisateurs du torrent, jamais ma connexion domestique. Pas besoin de VPN pour se protéger de cet échange peer-to-peer - le homelab ne fait que du HTTPS classique vers le cloud du debrideur, comme n'importe quel autre service en ligne.

Ce pari a pris un coup en mai 2026 : mon service de debrid principal a mis en place un filtrage par mots-clés sur les fichiers en cache, suite à une décision de justice française qui a fait remonter des listes de mots-clés aux fournisseurs. Résultat concret : des pans entiers de contenu (tags `WEB-DL`, `WEBRip`, `BDRip`...) devenaient injouables. La première réponse a été de garder ce service en priorité avec un second service de debrid en fallback automatique, mais les deux pouvaient se retrouver en cooldown simultanément, rendant le comportement imprévisible. Le premier service a fini par être **complètement désactivé** : aujourd'hui, seul le second est utilisé, tant que le premier reste soumis à ce filtre copyright.

## Riven plutôt que Zurg + Radarr/Sonarr/Prowlarr

Côté acquisition/gestion de la bibliothèque, deux approches s'affrontent dans l'écosystème debrid :

| | Riven (retenu) | Zurg + Radarr/Sonarr/Prowlarr |
|---|---|---|
| Services à déployer | 2 (Riven + Bazarr) | 6+ |
| Intégration debrid | Nativement conçu pour | Adaptée a posteriori |
| Interface demandes | Intégrée | Jellyseerr séparé |
| Contrôle qualité | Moyen | Très granulaire (custom formats) |
| Maturité | Récent (2024), actif | Très mature |

Riven l'emporte sur la simplicité opérationnelle - moins de services à faire vivre - au prix d'un contrôle qualité moins fin que la stack *arr historique. Un compromis assumé : je préfère 2 services à maintenir plutôt que 6, quitte à perdre un peu de granularité sur le tri.

En interne, Riven combine trois scrapers en parallèle - **Torrentio**, **Zilean** (hashlists DMM) et **Prowlarr** (indexeurs publics : Torrent9, World-torrent, Knaben, The Pirate Bay, LimeTorrents) - pour maximiser les chances de trouver une release correcte, avant de l'envoyer au debrider (AllDebrid en pratique aujourd'hui) puis de la monter via **RivenVFS**, un filesystem FUSE qui streame à la demande. Jellyfin lit ce montage comme un dossier local classique.

## Architecture

![Architecture du Netflix familial - flux public et pipeline de contenu](/articles/netflix-familial/architecture.svg)

Deux chemins bien distincts :

- **Le chemin public** (accès famille) : `Internet → Bbox (NAT) → OPNsense (GeoIP, France uniquement) → Traefik (bouncer CrowdSec + rate-limit + ipAllowList) → Jellyfin`. Jellyfin est le **seul** service de tout le homelab exposé publiquement - tout le reste (Vaultwarden, Forgejo, Grafana, Authentik, Riven...) reste strictement interne.
- **Le pipeline de contenu** (jamais exposé) : une demande famille part de Jellyseerr, Riven scrape les trois sources, envoie le meilleur candidat à AllDebrid, RivenVFS monte le résultat, et Jellyfin le sert avec transcodage matériel GPU si besoin.

Jellyseerr et Jellyfin-Vue tournent sur le cluster K3s (node-2), en stateless - aucune contrainte de filesystem partagé, donc aucune raison de les sortir du cluster. Riven, lui, doit obligatoirement cohabiter avec Jellyfin sur le même LXC : RivenVFS est un montage FUSE local, il ne se partage pas entre machines.

## Ressources allouées

Le conteneur LXC dédié (**privileged** - nécessaire pour le GPU passthrough et Docker en nesting) a été redimensionné deux fois en cours de route, chaque fois pour une raison observée en prod plutôt qu'anticipée :

| Ressource | Initial | Final | Pourquoi |
|---|---|---|---|
| vCPU | 2 | **6** | Zilean (indexation continue des hashlists DMM) sature 2 cœurs à lui seul (~190 %) et a fini par bloquer Riven entièrement par famine CPU. Passé à 4 en urgence, puis à 6 pour absorber plusieurs transcodages matériels simultanés - **test de charge réel confirmé fonctionnel avec 4 flux 4K→1080p simultanés**, 5 à la limite, 6 commence à bufferiser |
| RAM | 2 Go | **6 Go** | Jellyfin + Riven + cache RivenVFS |
| Disque | 10 Go | **50 Go** | Le cache RivenVFS seul est configuré jusqu'à 10 Go (`RIVEN_FILESYSTEM_CACHE_MAX_SIZE_MB`), une marge de 30 Go était trop juste |
| GPU | - | Intel UHD 630 (QuickSync/VAAPI) passthrough | Transcodage matériel : ~40 % CPU du process ffmpeg mesurés, contre 200 %+ en transcodage logiciel pur |

Le reste (Jellyseerr, Jellyfin-Vue) vit sur le cluster K3s en 2 replicas chacun - stateless, donc zéro downtime en cas de mise à jour ou de crash de pod.

## Une seule app pour la famille

Plutôt que de faire jongler la famille entre Jellyfin, Jellyseerr et Jellyfin-Vue, deux plugins communautaires ramènent tout dans Jellyfin :

- **Jellyfin-Enhanced** ajoute la recherche et la demande Jellyseerr directement dans l'UI web/mobile native.
- **JellyBridge** crée une bibliothèque "Discover" peuplée de tendances (placeholders vidéo) : un simple ♥ sur un titre déclenche la demande Jellyseerr - ça marche même sur Android TV, où l'intégration Enhanced ne fonctionne pas.

Un thème CSS custom (ElegantFin) habille l'UI native en quelque chose de plus proche d'un vrai service de streaming, sans rien installer côté famille. Test de bout en bout validé : ♥ sur une série dans Discover → demande Jellyseerr → scrape Riven → AllDebrid → RivenVFS → disponible dans la bibliothèque, en **environ 30 secondes**.

## Le tri par langue : le vrai point dur du projet

Trouver une release en français fiable s'est avéré plus compliqué que tout le reste de la stack réunie. Choix assumé après plusieurs allers-retours : le français n'est pas juste "préféré" dans le tri Riven, il est **obligatoire** - une release sans tag explicite (`VFF`, `VF2`, `TRUEFRENCH`, `VOSTFR`...) ou dans une autre langue est rejetée plutôt que servie en anglais par défaut, la famille préfère attendre plutôt que de tomber sur une VO surprise. Derrière cette règle simple, plusieurs correctifs de tri ont été nécessaires au fil des cas rencontrés (tag "MULTI" trompeur, sources qui disparaissent, vieux filtres qui bloquaient du contenu valide) - assez de détails pour un article à part entière. Je partagerai la config Riven prête à l'emploi prochainement.

## Exposer ça au public sans tout casser

Le vrai risque de ce projet n'est pas Jellyfin lui-même, mais le fait d'ouvrir un port vers l'extérieur. Plusieurs couches, testées une par une :

- **GeoIP** sur OPNsense : bloque tout ce qui n'est pas identifié comme France avant même d'atteindre le reverse proxy.
- **CrowdSec** sur Traefik : détection de brute-force sur le login Jellyfin. Testé en conditions réelles depuis un réseau externe : ban confirmé et effectif.
- **Rate-limit** Traefik : confirmé fonctionnel en conditions de charge réelle.
- **ipAllowList** : toutes les routes Traefik sauf celle de Jellyfin sont restreintes aux VLANs internes + Tailscale.
- **Comptes verrouillés** : aucune auto-inscription possible nulle part dans la chaîne - ni sur Jellyfin, ni sur Jellyseerr (l'ancienne option de création de compte via Plex y a été désactivée). Chaque compte famille est créé à la main.

Pendant le déploiement de l'exposition publique, un test a révélé que Traefik route uniquement sur le `Host:` de la requête, indépendamment de l'interface réseau d'origine du paquet - n'importe qui atteignant le port public avec le bon `Host:` (et le bon SNI) pouvait donc atteindre Vaultwarden, Forgejo ou Grafana depuis Internet, alors que seul Jellyfin devait être joignable. Corrigé par un middleware `ipAllowList` sur toutes les routes sauf `jellyfin-public`.

Autre presque-incident, découvert pendant le test CrowdSec : Jellyfin loggait l'IP de Traefik plutôt que celle du vrai client, faute de `<KnownProxies>` renseigné. Sans ce correctif, un ban CrowdSec aurait fini par bannir Traefik lui-même - coupant l'accès à tout le monde, famille comprise.

## Le pentest : vérifier plutôt que supposer

Un correctif jamais reconfirmé depuis une vraie IP externe reste une hypothèse, pas une garantie. J'ai fait passer la surface publique à un vrai passage d'outillage - `testssl.sh`, `nuclei` (6780 templates CVE/misconfig), `nikto` - depuis une IP réellement extérieure au LAN :

- **Fix Host-header reconfirmé** : les routes internes testées avec un `Host:`/SNI usurpé renvoient toutes `403`, y compris quand le certificat servi correspond bien au domaine interne visé - la faille du déploiement initial est bien corrigée.
- **TLS noté A+** (testssl.sh) : aucune faille historique (Heartbleed, POODLE, BEAST, CRIME, DROWN...), TLS 1.3 par défaut.
- **0 CVE** détectée par nuclei sur le catalogue complet de templates.

Rien de bloquant, mais rien d'inventé non plus : la liste ci-dessus est celle d'un vrai scan, pas d'une checklist recopiée.

Le code complet (playbooks Ansible, config Riven, rôle Traefik) sera publié prochainement en lien avec cet article. Merci de l'avoir lu.
