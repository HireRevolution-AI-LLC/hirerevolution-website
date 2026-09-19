#!/usr/bin/env bash
# Copy config/.env.<env> to that environment's website server as
# .env.production.local and restart the site so it picks the values up.
#
#   scripts/push-env.sh dev    # staging.hirerevolution.ai -> app dev
#   scripts/push-env.sh prod   # hirerevolution.ai         -> app prod
#
# The file lives outside git, so it survives deploys (git reset --hard keeps
# ignored files) but NOT a droplet rebuild: re-run this after `tofu apply`
# replaces the droplet.
set -euo pipefail

cd "$(dirname "$0")/.."

ENV="${1:-}"
case "$ENV" in
  # Reserved IP of the staging droplet (tofu output reserved_ip).
  dev)  HOST="${STAGING_HOST:-159.89.242.172}" ;;
  prod) HOST="${PROD_HOST:?set PROD_HOST: there is no production website server yet}" ;;
  *)    echo "usage: scripts/push-env.sh dev|prod" >&2; exit 2 ;;
esac

FILE="config/.env.$ENV"
[ -f "$FILE" ] || { echo "missing $FILE" >&2; exit 1; }

# Refuse a half-filled file: the site would only fail on the first submission.
missing=$(
  set -a; . "./$FILE"; set +a
  for k in APP_API_URL FIREBASE_WEB_API_KEY WEBSITE_SUBMITTER_EMAIL WEBSITE_SUBMITTER_PASSWORD; do
    [ -n "${!k:-}" ] || echo "$k"
  done
)
if [ -n "$missing" ]; then
  echo "$FILE has no value for:" $missing >&2
  exit 1
fi

KEY="$HOME/.ssh/hirerevolution_website_deploy"
SSH_OPTS=(-i "$KEY" -o StrictHostKeyChecking=accept-new)
APP_DIR=/var/www/hirerevolution-website

scp "${SSH_OPTS[@]}" "$FILE" "root@$HOST:$APP_DIR/.env.production.local"
ssh "${SSH_OPTS[@]}" "root@$HOST" \
  "chmod 600 $APP_DIR/.env.production.local && cd $APP_DIR && pm2 reload ecosystem.config.js --update-env >/dev/null && pm2 status"

echo "Pushed $FILE to $HOST"
