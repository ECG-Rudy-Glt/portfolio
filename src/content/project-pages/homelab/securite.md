---
project: homelab
title: "La sécurité - et le pentest mené sur ma propre infra"
summary: "Les couches de protection (PKI, SSO, IDS, exposition publique durcie) sont sur la page projet. Ici : la rotation complète des credentials, et surtout les résultats bruts d'un pentest mené en conditions réelles."
order: 7
---

Les couches de protection déjà en place - PKI interne, SSO, Suricata, CrowdSec, blocage
géographique - sont détaillées sur la
[page projet](/projets/homelab/#sécurité-réseau-détection-blocage-visibilité) et dans l'article
[Construire une PKI interne](/blog/homelab-pki-secrets/). Cette page couvre ce qui n'est écrit
nulle part ailleurs : la démarche de vérification, et ce qu'un vrai test d'intrusion a trouvé.

## Ne pas se contenter de documenter qu'on pense être sécurisé

Beaucoup de projets personnels s'arrêtent à "j'ai mis un firewall et un VPN, donc c'est
sécurisé". Une fois les protections construites, elles ont été **attaquées volontairement** depuis
l'extérieur pour vérifier qu'elles tiennent vraiment - pas juste sur le papier. Le volet interne (scénario d'un attaquant déjà présent sur un VLAN) reste à mener.

## La rotation complète des credentials avant tout test

Avant de lancer le moindre test d'intrusion, tous les secrets créés pendant la phase de
construction ont été considérés comme brûlés et roulés intégralement - accès système, clés SSH
partagées, secrets applicatifs, jetons API tiers. Tester avec des identifiants potentiellement
déjà exposés aurait faussé les résultats.

## Le pentest - ce qui a vraiment été trouvé

### Ce qui tient, vérifié en conditions réelles

Testé depuis un vrai point de vue externe (connexion mobile, VPN étranger - pas depuis le réseau
interne, qui aurait contourné les protections et faussé les résultats) :

- **Aucune fuite de route interne** : impossible d'atteindre un service interne (tableau de bord
  du reverse proxy, interface d'administration DNS) en pointant directement l'IP publique avec le
  bon en-tête d'hôte
- **Le rate-limiting fonctionne réellement** : une rafale de requêtes au-delà du seuil configuré
  déclenche un rejet contrôlé, sans jamais faire tomber le service
- **La détection de brute-force fonctionne de bout en bout** : une tentative de connexions
  répétées échouées a été détectée, une décision de blocage créée, et appliquée au niveau réseau
  - pas juste au niveau applicatif
- **Le filtrage géographique bloque réellement** : testé depuis un VPN localisé hors de la zone
  autorisée, la connexion est coupée avant même d'atteindre l'application

### Le volet interne, à mener

Le test externe ne couvre qu'un scénario : un attaquant qui n'a jamais mis un pied sur le réseau.
Le scénario complémentaire - un attaquant qui dispose déjà d'un accès partiel, sur un VLAN
compromis par exemple - reste à mener depuis l'intérieur du réseau. Il fait partie de
[la suite](/projets/homelab/perspectives/).

Le pentest a aussi remonté plusieurs points à corriger, traités au fur et à mesure - un audit qui
ne trouve jamais rien n'a pas été fait sérieusement. Le détail précis de chaque écart n'a pas sa
place ici (surface d'attaque publique), mais la méthode et l'honnêteté du résultat, elles, sont
le vrai objet de cette page : ce n'est pas une affirmation vague de "sécurité renforcée", c'est
un audit avec des faits vérifiés, corrigés, et suivis.

## Ce qui a été durci depuis le pentest

La sécurité n'est pas un état atteint une fois, et les incidents ont souvent montré où durcir :

- **Proxmox en HTTPS propre** : l'interface d'administration des nœuds présente maintenant un
  certificat signé par la PKI interne, renouvelé chaque jour par un rôle OpenBao qui ne peut
  qu'émettre ce certificat-là.
- **Le reverse proxy ne dépend plus d'Internet pour démarrer** : le plugin CrowdSec est embarqué
  dans sa configuration, après une panne où il avait désactivé en silence toutes les routes
  publiques (voir [les vraies pannes](/projets/homelab/incidents/)). Des sondes vérifient en
  continu que les routes publiques et le DNS répondent.
- **Aucun secret ne peut entrer dans le dépôt** : scan des secrets avant chaque commit, et un hook
  qui bloque les commandes contenant un jeton en clair, y compris celles lancées par un agent.
- **Un agent IA encadré, pas libre** : l'assistant du lab n'a aucun accès réseau direct aux
  services de la maison, passe par un service de politique qui détient les jetons, et ne peut pas
  confirmer lui-même une action sensible. Il a eu sa propre passe de sécurité (verrous, limites de
  débit, durcissement du service, droits des fichiers) - détail en
  [outillage IA](/projets/homelab/outillage-ia/).
