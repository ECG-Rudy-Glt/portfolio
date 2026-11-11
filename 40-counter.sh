#!/bin/sh
# Lancé par l'entrypoint nginx avant le serveur : met à jour /tmp/stats.json toutes les 30 s depuis /data/hits.log.
# Chaque visite = une ligne de 2 octets (« x » + saut de ligne) : total = taille / 2. /data est un volume persistant.
set -eu
mkdir -p /data
[ -f /data/since ] || date +%Y-%m-%d > /data/since
touch /data/hits.log
(
  while true; do
    n=$(( $(wc -c < /data/hits.log) / 2 ))
    printf '{"views":%s,"since":"%s"}\n' "$n" "$(cat /data/since)" > /tmp/stats.json.tmp && mv /tmp/stats.json.tmp /tmp/stats.json
    sleep 30
  done
) &
