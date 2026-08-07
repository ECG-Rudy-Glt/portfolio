---
project: homelab
title: "Sur l'usage de Claude Code"
summary: "Ce homelab a été construit avec Claude Code comme outil de travail au quotidien - un choix assumé, pas caché. Pourquoi, ce que ça a changé, et les limites que je m'y connais encore."
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

## Ce que je ne maîtrise pas encore en profondeur

Honnêtement : je n'ai pas configuré 100 % de ce lab moi-même, à la main, ligne par ligne. Une
partie a été produite avec l'aide de Claude Code, ce qui veut dire qu'il existe des recoins de
ma propre infrastructure que je ne connais pas avec la même profondeur que ce que j'ai tapé et
décidé moi-même de bout en bout. C'est un vrai angle mort que j'assume plutôt que de prétendre
maîtriser chaque ligne de config au même niveau.

## Le plan pour combler ça

Reprendre progressivement ce qui a été généré plutôt qu'écrit à la main - le comprendre bloc par
bloc, pas juste vérifier que ça tourne - fait partie du travail en cours, pas seulement du
"terminé". En parallèle, des labs dédiés à l'IA sont prévus tout au long de ma dernière année
d'école, pour construire une vraie compréhension technique des LLM eux-mêmes (au-delà de savoir
les utiliser en outil de production). La piste déjà posée sur ce homelab - un LLM local,
auto-hébergé, branché à de vraies automatisations d'infrastructure plutôt qu'à des cas d'usage
jouets - est détaillée en [la suite](/projets/homelab/perspectives/).

## Rester lucide sur l'usage de l'IA, pas y renoncer

Le travail assisté par IA va continuer à faire partie de ma pratique - le nier serait aussi
malhonnête que de prétendre qu'il n'y a eu aucune assistance sur ce projet. Mais ça n'a de sens
que si les bases de compréhension technique restent solides derrière : savoir lire et challenger
ce qui est produit, savoir reconstruire à la main si l'outil n'est pas disponible, savoir
distinguer une bonne décision d'architecture d'une réponse simplement plausible. L'objectif n'est
pas de choisir entre "tout faire soi-même" et "tout déléguer" - c'est de rester lucide sur lequel
des deux est en train de se passer à chaque instant, et de garder la main sur le premier.
