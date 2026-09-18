# Deployment Guide — HireRevolution.ai Website

## Quick Start (DigitalOcean)

### Prerequisites
- DigitalOcean account (create one at https://www.digitalocean.com/)
- Domain name pointing to DigitalOcean nameservers (or will update DNS after droplet creation)
- GitHub account (optional, but recommended for deployments)

---

## Option 1: Deploy with Docker (Recommended)

### 1. Create a DigitalOcean Droplet

1. Log in to DigitalOcean dashboard
2. Click **Create** → **Droplets**
3. Choose settings:
   - **Image:** Ubuntu 22.04 (LTS)
   - **Size:** Basic ($6/month, 512MB RAM)
   - **Region:** New York or closest to your users
   - **Authentication:** SSH key (or password)
   - **Hostname:** hirerevolution-website
4. Click **Create Droplet**

### 2. SSH into the Droplet

```bash
ssh root@<DROPLET_IP>
```

### 3. Install Docker & Docker Compose

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker
```

### 4. Clone the Repository

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/hr-marketing-website.git
cd hr-marketing-website
```

### 5. Build and Run with Docker

```bash
docker build -t hirerevolution-website:latest .
docker run -d -p 80:3000 --name hirerevolution-website hirerevolution-website:latest
```

### 6. Verify It's Running

```bash
curl http://localhost
```

You should see the HTML homepage.

---

## Option 2: Deploy with Node.js + PM2

### 1. Create Droplet (same as Option 1, steps 1–2)

### 2. Install Node.js & PM2

```bash
# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
sudo npm install -g pm2
```

### 3. Clone and Setup

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/hr-marketing-website.git
cd hr-marketing-website
npm install
npm run build
```

### 4. Start with PM2

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

This will:
- Start the app in cluster mode (uses all CPU cores)
- Auto-restart on crash
- Start automatically on server reboot
- Log errors and output to `./logs/`

### 5. Verify

```bash
pm2 status
curl http://localhost:3000
```

---

## Setup Reverse Proxy (Nginx)

Both Docker and PM2 need a reverse proxy to handle port 80 → 3000 mapping.

### 1. Install Nginx

```bash
sudo apt-get update
sudo apt-get install -y nginx
```

### 2. Create Nginx Config

```bash
sudo nano /etc/nginx/sites-available/hirerevolution.ai
```

Paste:

```nginx
server {
    listen 80;
    server_name hirerevolution.ai www.hirerevolution.ai;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 3. Enable the Config

```bash
sudo ln -s /etc/nginx/sites-available/hirerevolution.ai /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## Setup SSL Certificate (Let's Encrypt)

### 1. Install Certbot

```bash
sudo apt-get install -y certbot python3-certbot-nginx
```

### 2. Generate Certificate

```bash
sudo certbot --nginx -d hirerevolution.ai -d www.hirerevolution.ai
```

Follow the prompts. Certbot will:
- Validate domain ownership
- Create SSL certificate
- Auto-renew every 90 days

### 3. Verify SSL

Visit `https://hirerevolution.ai` in your browser. You should see a green lock icon.

---

## Point Domain to Droplet

In your domain registrar (GoDaddy, Namecheap, etc.):

1. Go to DNS settings
2. Update A record to point to your droplet IP:
   ```
   A    hirerevolution.ai    <DROPLET_IP>
   A    www.hirerevolution.ai    <DROPLET_IP>
   ```
3. Wait 5–15 minutes for DNS propagation

---

## Update Environment Variables

If you need env vars, create `.env.production`:

```bash
nano .env.production
```

Add any needed vars:

```
NEXT_PUBLIC_API_URL=https://api.hirerevolution.ai
```

Then restart:

```bash
# For PM2
pm2 restart hirerevolution-website

# For Docker
docker restart hirerevolution-website
```

---

## Monitor & Maintain

### PM2 Commands

```bash
# View logs
pm2 logs hirerevolution-website

# Restart
pm2 restart hirerevolution-website

# Stop
pm2 stop hirerevolution-website

# View status
pm2 status
```

### Docker Commands

```bash
# View logs
docker logs -f hirerevolution-website

# Restart
docker restart hirerevolution-website

# Stop
docker stop hirerevolution-website

# Remove
docker rm hirerevolution-website
```

### Update the App

Pull latest code and redeploy:

**PM2:**
```bash
cd ~/hr-marketing-website
git pull origin main
npm run build
pm2 restart hirerevolution-website
```

**Docker:**
```bash
cd ~/hr-marketing-website
git pull origin main
docker build -t hirerevolution-website:latest .
docker stop hirerevolution-website
docker rm hirerevolution-website
docker run -d -p 80:3000 --name hirerevolution-website hirerevolution-website:latest
```

---

## Troubleshooting

### Site Not Loading?

1. Check droplet IP is correct: `curl http://<DROPLET_IP>`
2. Check DNS: `nslookup hirerevolution.ai`
3. Check Nginx: `sudo systemctl status nginx`
4. Check app logs: `pm2 logs` or `docker logs hirerevolution-website`

### SSL Certificate Issues?

Renew manually:
```bash
sudo certbot renew --force-renewal
```

---

## Need Help?

- DigitalOcean Docs: https://docs.digitalocean.com/
- Next.js Deployment: https://nextjs.org/docs/deployment
- Nginx Docs: https://nginx.org/en/docs/
