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
l'extérieur pour vérifier qu'elles tiennent vraiment - pas juste sur le papier. Le volet interne
(scénario d'un attaquant déjà présent sur un VLAN) est en cours de test au moment où j'écris ces
lignes.

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

### Le volet interne, en cours

Le test externe ne couvre qu'un scénario : un attaquant qui n'a jamais mis un pied sur le réseau.
Le scénario complémentaire - un attaquant qui dispose déjà d'un accès partiel, sur un VLAN
compromis par exemple - est actuellement en cours de test, depuis l'intérieur du réseau cette
fois. Les résultats viendront compléter cette page une fois le test terminé.

Le pentest a aussi remonté plusieurs points à corriger, traités au fur et à mesure - un audit qui
ne trouve jamais rien n'a pas été fait sérieusement. Le détail précis de chaque écart n'a pas sa
place ici (surface d'attaque publique), mais la méthode et l'honnêteté du résultat, elles, sont
le vrai objet de cette page : ce n'est pas une affirmation vague de "sécurité renforcée", c'est
un audit avec des faits vérifiés, corrigés, et suivis.
