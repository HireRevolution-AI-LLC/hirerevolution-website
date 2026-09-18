#!/bin/bash
set -e

echo "🚀 HireRevolution Website - Initial Deployment"

# Update system
apt-get update
apt-get upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# Install PM2 globally
npm install -g pm2

# Install Git
apt-get install -y git

# Install Nginx
apt-get install -y nginx

# Install Certbot
apt-get install -y certbot python3-certbot-nginx

# Create app directory
mkdir -p /var/www/hirerevolution-website
cd /var/www/hirerevolution-website

# Clone repository
git clone ${github_repo} .

# Install dependencies
npm install --omit=dev

# Build Next.js
npm run build

# Configure PM2
pm2 start ecosystem.config.js --name hirerevolution-website
pm2 save
pm2 startup -u root --hp /root

# Configure Nginx
cat > /etc/nginx/sites-available/default <<'NGINX_CONF'
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    server_name _;

    location / {
        proxy_pass http://localhost:3000;
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

# Test and start Nginx
nginx -t
systemctl restart nginx
systemctl enable nginx

# Create log directory for PM2
mkdir -p /var/www/hirerevolution-website/logs

echo "✅ Initial deployment complete"
echo "App is running on port 3000"
echo "Nginx is reverse proxying on port 80"
