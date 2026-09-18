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

git clone ${github_repo} /var/www/hirerevolution-website
cd /var/www/hirerevolution-website
npm ci
npm run build
pm2 start ecosystem.config.js
pm2 save
pm2 startup systemd -u root --hp /root

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
