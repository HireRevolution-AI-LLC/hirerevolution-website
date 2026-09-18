# Quick Start: Deploy to DigitalOcean in 15 Minutes

## Prerequisites Checklist

- [ ] GitHub account (free at https://github.com)
- [ ] DigitalOcean account (free $200 credit at https://www.digitalocean.com/?refcode=6d4f88d53f07)
- [ ] Domain name (can use existing `hirerevolution.ai`)
- [ ] SSH key generated locally (or password authentication)

---

## Step 1: Push Code to GitHub (2 min)

```bash
# Add GitHub as remote (replace with your repo URL)
cd ~/PycharmProjects/hr-marketing-website
git remote add origin https://github.com/YOUR_USERNAME/hirerevolution-website.git
git branch -M main
git push -u origin main
```

✅ **Code is now on GitHub**

---

## Step 2: Create DigitalOcean Droplet (2 min)

1. Log in to DigitalOcean: https://cloud.digitalocean.com/
2. Click **Create** → **Droplets**
3. Select:
   - **Image:** Ubuntu 22.04 (LTS)
   - **Size:** $6/month (1GB RAM, 25GB storage)
   - **Region:** New York (or closest to you)
   - **Authentication:** SSH key (recommended) or password
   - **Hostname:** hirerevolution-website
4. Click **Create Droplet**
5. Note the IP address (you'll need it)

✅ **Droplet is running**

---

## Step 3: SSH into Droplet (1 min)

```bash
ssh root@YOUR_DROPLET_IP
```

(If using password auth, enter password when prompted)

---

## Step 4: Run One-Line Setup (5 min)

Copy & paste this entire block into your droplet terminal:

```bash
# Update system
sudo apt-get update && sudo apt-get upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Clone repository
cd ~
git clone https://github.com/YOUR_USERNAME/hirerevolution-website.git
cd hirerevolution-website

# Install dependencies
npm install --omit=dev

# Build Next.js
npm run build

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# Install Nginx
sudo apt-get install -y nginx

# Create Nginx config
sudo tee /etc/nginx/sites-available/hirerevolution.ai > /dev/null <<EOF
server {
    listen 80;
    server_name hirerevolution.ai www.hirerevolution.ai;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable Nginx config
sudo ln -s /etc/nginx/sites-available/hirerevolution.ai /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Install SSL (Let's Encrypt)
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d hirerevolution.ai -d www.hirerevolution.ai

echo "✅ Deployment complete!"
```

---

## Step 5: Update Domain DNS (2 min)

1. Go to your domain registrar (GoDaddy, Namecheap, etc.)
2. Find DNS settings
3. Update A records:
   ```
   A    hirerevolution.ai         YOUR_DROPLET_IP
   A    www.hirerevolution.ai     YOUR_DROPLET_IP
   ```
4. Save and wait 5–15 minutes for DNS to propagate

---

## Step 6: Verify

```bash
# On your droplet
curl http://localhost:3000
curl http://hirerevolution.ai

# From your computer (after DNS propagates)
curl https://hirerevolution.ai
```

You should see the HTML homepage.

✅ **Site is now live at https://hirerevolution.ai**

---

## Monitoring & Updates

### View Logs
```bash
pm2 logs hirerevolution-website
```

### Restart App
```bash
pm2 restart hirerevolution-website
```

### Update Code
```bash
cd ~/hirerevolution-website
git pull origin main
npm run build
pm2 restart hirerevolution-website
```

---

## Cost Breakdown

- **Droplet:** $6/month (basic, auto-scales if needed)
- **Domain:** ~$10/year (existing)
- **SSL:** Free (Let's Encrypt)
- **Total:** ~$6/month

---

## Troubleshooting

### Site not loading?
```bash
# Check if app is running
pm2 status

# Check logs
pm2 logs hirerevolution-website

# Check Nginx
sudo systemctl status nginx
sudo nginx -t
```

### DNS not working?
- Wait 5–15 minutes
- Check with: `nslookup hirerevolution.ai`
- Verify A records in registrar

### SSL certificate issues?
```bash
sudo certbot renew --dry-run
sudo certbot renew
```

---

## Next Steps

1. ✅ Site is live
2. Add your logo images to `public/` directory
3. Update the OG image at `public/og-image.jpg`
4. Configure email for the JD submission form
5. Add analytics (Google Analytics, Plausible, etc.)

See `DEPLOYMENT.md` for detailed configuration options.

---

## Support

- DigitalOcean Docs: https://docs.digitalocean.com/
- Next.js Docs: https://nextjs.org/docs
- PM2 Docs: https://pm2.keymetrics.io/

Good luck! 🚀
