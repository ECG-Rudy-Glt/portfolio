---
project: ops-delivery-suite
title: "Data Sentinel"
summary: "Sauvegarde « fire & forget » : bases et fichiers, chiffrement GPG, export S3, rétention automatique et alertes Discord ou Slack."
order: 5
---

## À quoi ça sert

« Même si le serveur brûle ou se fait pirater, je remonte tout en une heure. » Data Sentinel sauvegarde ce qui compte hors du serveur, chaque nuit, sans intervention.

## Comment ça marche

1. **Dump** des bases MySQL/MariaDB, PostgreSQL et MongoDB qui tournent dans des conteneurs Docker (`docker exec`).
2. **Archive** des dossiers applicatifs, avec exclusions.
3. **Chiffrement** GPG optionnel.
4. **Envoi** vers un stockage compatible S3 : AWS, Scaleway, MinIO, Backblaze, DigitalOcean.
5. **Rétention** : 7 sauvegardes quotidiennes, 4 hebdomadaires, 3 mensuelles par défaut.
6. **Notification** Discord ou Slack avec la taille et la durée, ou l'erreur.

## Utilisation

```bash
cd data-sentinel
cp config.example.yaml config.yaml   # bucket, bases, dossiers, rétention
make dry-run                          # simulation, sans envoi
make backup                           # sauvegarde immédiate
make install-cron                     # tous les jours à 3 h
make list                             # sauvegardes présentes sur S3
python restore.py --latest            # restauration (--db-only, --files-only, --date)
```

Le mot de passe de chaque base n'est pas dans la configuration : on indique le nom de la variable d'environnement du conteneur qui le contient (`password_env: MYSQL_ROOT_PASSWORD`).

## Ce que j'ai corrigé avant publication

Les trois dumpers ont été testés sur de vrais conteneurs (MariaDB 11, PostgreSQL 16, MongoDB), avec un mot de passe piégé (`p@ss w0rd;$(id)"`…), jusqu'à la restauration :

- **PostgreSQL ne fonctionnait pas.** Les options `--no-owner --no-acl` étaient transmises à `pg_dump` comme un seul argument, qu'il refusait. Le fichier portait aussi l'extension `.sql` alors que la restauration attend `.dump`.
- **MySQL passait par un shell.** La commande était une chaîne concaténée, mot de passe compris : un mot de passe avec un espace ou un `;` cassait le dump (ou exécutait autre chose), et il apparaissait en clair dans `ps`. Le mot de passe reste maintenant dans le conteneur (`MYSQL_PWD`), sans shell côté hôte, avec repli sur `mariadb-dump` pour les images MariaDB récentes.
- **MongoDB** recevait aussi le mot de passe en argument ; il passe par un fichier de configuration temporaire.
- **Rétention.** Les dates S3 (UTC) étaient comparées à l'heure locale, d'où un décalage de quelques heures dans les suppressions.
- Les dumps sont créés avec des droits `600`, et un dump en échec est supprimé au lieu de rester à moitié écrit.

[Voir le code sur GitHub](https://github.com/ECG-Rudy-Glt/ops-delivery-suite/tree/main/data-sentinel)
