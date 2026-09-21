#!/bin/bash
# Rendered by templatefile(): only $${...} is interpolated, so use $VAR (no braces) for shell vars.
set -euxo pipefail
export HOME=/root
export DEBIAN_FRONTEND=noninteractive
APT="apt-get -y -o Dpkg::Options::=--force-confdef -o Dpkg::Options::=--force-confold"

# next build needs more than 1GB RAM
fallocate -l 2G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab

apt-get update
$APT upgrade
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
$APT install nodejs git nginx certbot python3-certbot-nginx
npm install -g pm2

# The site runs as an unprivileged user, and so does its deploy. The CI key
# goes only in this user's authorized_keys (root keeps the operator keys), so
# a compromise of the deploy workflow costs the website and not the droplet.
# `deploy` gets no sudo: git, npm and pm2 all run as itself.
adduser --disabled-password --gecos "" deploy
install -d -m 700 -o deploy -g deploy /home/deploy/.ssh
# Non-fatal: cloud-init normally writes root's authorized_keys before this
# runs, but if the key is not there yet the box should still finish booting.
# Without it CI cannot deploy -- copy the key in by hand and carry on.
grep -F 'github-actions@hirerevolution-website' /root/.ssh/authorized_keys \
  > /home/deploy/.ssh/authorized_keys \
  || echo "WARN: CI key not found in root's authorized_keys; add it to /home/deploy/.ssh/authorized_keys"
chown deploy:deploy /home/deploy/.ssh/authorized_keys
chmod 600 /home/deploy/.ssh/authorized_keys

git clone ${github_repo} /var/www/hirerevolution-website
chown -R deploy:deploy /var/www/hirerevolution-website
su - deploy -c 'cd /var/www/hirerevolution-website && npm ci && npm run build && pm2 start ecosystem.config.js && pm2 save'
pm2 startup systemd -u deploy --hp /home/deploy
systemctl enable pm2-deploy

# A rebuilt droplet has no .env.production.local: run scripts/push-env.sh.

# Do not advertise the nginx version in responses and error pages.
sed -i 's|^\(\s*\)#\s*server_tokens off;|\1server_tokens off;|' /etc/nginx/nginx.conf

cat > /etc/nginx/sites-available/default <<'NGINX_CONF'
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name ${site_domain} _;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
NGINX_CONF
nginx -t
systemctl enable nginx
systemctl restart nginx

# HTTPS for the staging hostname. Non-fatal: the site still serves on :80 if DNS isn't pointed here yet.
certbot --nginx -d ${site_domain} --non-interactive --agree-tos --register-unsafely-without-email --redirect \
  || echo "WARN: certbot failed for ${site_domain}; rerun it once DNS resolves to this droplet"
echo "HIREREV_BOOTSTRAP_DONE"
