---
project: homelab
title: "Pourquoi ce projet"
summary: "La motivation derrière 870€ et plusieurs mois de soirées : monter en compétences sur toute une infrastructure, préparer l'après-alternance et l'indépendance."
order: 1
---

## Le point de départ

Ce projet a démarré dans le cadre de la fin de ma 4e année à Supinfo (parcours DevOps, en
alternance) - mais il ne s'arrête pas à un rendu académique. Une alternance apprend un métier
dans le cadre d'une entreprise : un stack, des process, un périmètre. J'avais besoin de sortir de
ce périmètre pour toucher à des couches que mon poste ne me donne pas l'occasion de pratiquer :
réseau bare metal, PKI interne, sécurité offensive.

## Ce que je voulais en tirer

**Toute la chaîne, pas un maillon.** Un poste DevOps en entreprise touche rarement à la fois le
réseau, l'hyperviseur, l'IaC, la sécurité et l'observabilité. Ici, je suis seul responsable de
toute la pile - du VLAN au certificat TLS en passant par le firewall inter-services. C'est
inconfortable au début (personne à qui déléguer un bug réseau à 23h) mais c'est exactement ce qui
construit une vision d'ensemble.

**Me former en pratique, pas en théorie.** Lire une doc sur la segmentation réseau et configurer
des VLANs avec des règles de firewall qui doivent réellement tenir (voir
[la sécurité](/projets/homelab/securite/)) - pas la même compréhension.

**Compléter ce que l'alternance ne couvre pas.** Sécurité offensive, PKI interne, GitOps sur un
vrai cluster K8s, gestion de secrets avec un coffre-fort - autant de sujets pratiqués ici en
autonomie complète, décisions et erreurs comprises.

**Préparer l'indépendance et l'après-alternance.** À terme, l'objectif est de pouvoir opérer seul
une infrastructure de bout en bout, et préparer une activité freelance - notamment en sécurité.
Un pentest mené sur sa propre infrastructure, avec l'autorisation la plus totale possible
puisqu'elle est la sienne, est un terrain d'entraînement réaliste qu'aucun CTF ne reproduit tout
à fait.

**Ne plus dépendre des GAFAM par défaut.** Reprendre le contrôle sur ce qui peut raisonnablement
l'être (mots de passe, photos, fichiers, musique, DNS) - fil conducteur détaillé en
[la suite](/projets/homelab/perspectives/).

## Une contrainte non négociable dès le départ

Ce homelab tourne à la maison, sur le même réseau que ma conjointe - qui est en télétravail
régulier. Hors de question que mes expérimentations réseau viennent perturber sa connexion
pendant qu'elle travaille. Cette contrainte a pesé sur l'architecture dès le premier schéma : le
lab devait être isolé proprement du reste du foyer, pas l'inverse. Voir
[l'infrastructure](/projets/homelab/infrastructure/) pour le détail de cette segmentation.

## Pourquoi ça tient dans la durée

Ma famille utilise réellement ce qui tourne ici (streaming, mots de passe, bientôt musique et
photos), ce qui crée une pression opérationnelle authentique - quand quelque chose tombe,
quelqu'un le remarque. Cette contrainte est volontaire : elle force à traiter les pannes et la
sécurité comme on le ferait en production, pas comme un TP qu'on peut laisser cassé.
