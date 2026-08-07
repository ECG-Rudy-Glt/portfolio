---
project: homelab
title: "L'équipement - les choix et leurs raisons"
summary: "Le détail du matériel est sur la page projet. Ici, le pourquoi de chaque choix : les alternatives écartées, les compromis, et ce que ça remplace en coût réel."
order: 2
---

Le détail chiffré (composants, prix, specs) est sur la
[page principale du projet](/projets/homelab/#le-matériel). Cette page couvre le raisonnement
derrière chaque choix - ce qui ne rentre pas dans un tableau.

## Pourquoi un firewall dédié plutôt qu'une VM OPNsense

L'option la plus simple aurait été une VM OPNsense sur un des nœuds Proxmox - zéro matériel
supplémentaire. Écarté volontairement : si l'hyperviseur tombe, le réseau tombe avec lui, plus
aucun accès pour diagnostiquer quoi que ce soit. Un mini-PC dédié (~170€) isole ce risque. Ce
choix s'est vérifié en conditions réelles : lors d'une panne où les deux nœuds Proxmox étaient
injoignables, le firewall est resté up et a servi de poste d'observation pendant tout le
diagnostic (voir [les incidents](/projets/homelab/incidents/)).

## Pourquoi 2 nœuds plutôt qu'un seul plus puissant

Un seul serveur plus costaud aurait été moins cher à performance égale. Le choix de 2 machines
répond à un besoin différent : répartir les rôles (services permanents / dev-CI-K8s) et pratiquer
de vrais réflexes de cluster - migration de VM, tolérance partielle aux pannes, quorum. C'est un
choix pédagogique autant que technique - facilité aussi par une bonne affaire tombée au bon
moment : les deux EliteDesk ont été trouvés en lot à ~370€, un prix qui a fini de trancher entre
"un gros serveur" et "deux machines pour pratiquer le cluster".

## Pourquoi des mini-PC plutôt que du matériel serveur rack classique

Consommation. Le rack 7U aurait pu accueillir de vrais serveurs 1U, mais leur consommation idle
(souvent 60-100W par unité) aurait fait exploser la facture électrique pour un usage domestique
qui ne justifie pas cette puissance en continu. Les mini-PC (EliteDesk, N150) tournent à
6-25W chacun - le compromis retenu entre capacité de calcul réelle et sobriété.

## Le CPL plutôt que le WiFi pour la TV du salon

Un détail révélateur de la contrainte principale du projet : ne jamais dégrader l'usage du reste
du foyer, notamment le télétravail de ma conjointe (voir [pourquoi ce projet](/projets/homelab/pourquoi/)).
Le WiFi partagé avec le reste de la maison peut suffire pour du streaming, mais un CPL filaire
dédié évite toute contention avec le trafic domestique - la fiabilité prime sur le prix (~35€
l'adaptateur).

## Ce que ce budget remplace

Le calcul qui rend l'investissement intéressant n'est pas "combien j'ai dépensé" mais "qu'est-ce
que ça remplace". Sur ce lab tournent, entre autres : un gestionnaire de mots de passe familial,
un service de streaming, une forge Git avec CI/CD, un hub domotique - et bientôt un cloud
personnel et une galerie photo (voir [la suite](/projets/homelab/perspectives/)). Additionner les
abonnements équivalents sur 2-3 ans dépasse largement le coût matériel initial, sans compter que
les données restent chez moi plutôt que chez un tiers.

Le vrai coût de ce projet n'est de toute façon pas dans le matériel - c'est le temps. Documenter
chaque décision et chaque panne (voir [les incidents](/projets/homelab/incidents/)) prend
largement plus d'heures que le montage physique. C'est un choix assumé : c'est ce qui transforme
un homelab en preuve de compétence exploitable, pas juste une infra qui tourne.
