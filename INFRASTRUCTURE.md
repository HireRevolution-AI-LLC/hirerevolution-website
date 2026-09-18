# Infrastructure Setup — OpenTofu + GitHub Actions

This guide walks you through deploying the website to DigitalOcean with automated CI/CD.

---

## Architecture

```
GitHub (main branch push)
    ↓
GitHub Actions (build & deploy)
    ↓
DigitalOcean Droplet (Ubuntu 22.04)
    ↓
PM2 (app process manager)
    ↓
Nginx (reverse proxy on port 80)
    ↓
Next.js app (port 3000)
```

---

## Prerequisites

- ✅ OpenTofu installed locally (`brew install opentofu`)
- ✅ DigitalOcean account with API token
- ✅ SSH key in `~/.ssh/id_ed25519.pub`
- ✅ GitHub repo at `https://github.com/HireRevolution-AI-LLC/hirerevolution-website`

---

## Step 1: Create DigitalOcean API Token

1. Go to https://cloud.digitalocean.com/account/api/tokens
2. Click **Generate New Token**
3. Name it: `hirerevolution-website`
4. Select **Read and Write** scope
5. Generate and **copy the token** (you'll need it in Step 3)

---

## Step 2: Create `terraform.tfvars`

```bash
cd /Users/greggwcasey/PycharmProjects/hr-marketing-website/terraform

# Copy the example file
cp terraform.tfvars.example terraform.tfvars

# Edit it with your values
nano terraform.tfvars
```

Fill in:

```hcl
do_token       = "dop_v1_YOUR_TOKEN_HERE"  # From Step 1
ssh_public_key = "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAI..." # From ~/.ssh/id_ed25519.pub

# Optional
droplet_name   = "hirerevolution-website-staging"
droplet_region = "nyc3"  # or your preferred region
droplet_size   = "s-1vcpu-1gb"  # $6/month
environment    = "staging"
```

**Important:** `terraform.tfvars` is in `.gitignore` — it contains secrets, never commit it.

---

## Step 3: Deploy Infrastructure with OpenTofu

```bash
cd /Users/greggwcasey/PycharmProjects/hr-marketing-website/terraform

# Initialize OpenTofu
tofu init

# Plan the deployment (see what will be created)
tofu plan

# Apply (creates the droplet)
tofu apply
```

This will:
- ✅ Create a DigitalOcean droplet
- ✅ Upload your SSH key
- ✅ Configure firewall (ports 22, 80, 443)
- ✅ Assign a reserved IP
- ✅ Install Node.js, PM2, Nginx
- ✅ Clone the repo and deploy the app

**Output:** You'll see:
```
droplet_ip = "123.45.67.89"
reserved_ip = "123.45.67.90"
website_url = "http://123.45.67.89"
ssh_command = "ssh root@123.45.67.89"
```

---

## Step 4: Test Initial Deployment

Wait 2-3 minutes for the droplet user_data script to finish, then:

```bash
# SSH into the droplet
ssh root@123.45.67.89

# Check PM2 status
pm2 status

# Check logs
pm2 logs hirerevolution-website

# Test locally
curl http://localhost
```

You should see the homepage HTML. If not, check logs.

---

## Step 5: Configure GitHub Secrets for CI/CD

1. Go to GitHub repo → **Settings → Secrets and variables → Actions**

2. Add these secrets:

   | Name | Value |
   |------|-------|
   | `STAGING_HOST` | The `reserved_ip` from OpenTofu output (e.g., `123.45.67.90`) |
   | `SSH_PRIVATE_KEY` | Contents of `~/.ssh/id_ed25519` (your private key) |

3. Save

---

## Step 6: Test CI/CD Pipeline

Make a small change to the site and push to `main`:

```bash
# In the website repo
echo "# Deployed at $(date)" >> README.md
git add README.md
git commit -m "Test CI/CD deployment"
git push origin main
```

**Watch the deploy:**
1. Go to GitHub repo → **Actions**
2. Click the workflow run
3. Watch as it builds and deploys

After ~1 minute, visit `http://123.45.67.90` — you should see the updated site.

---

## Step 7: Test the Website

Visit `http://YOUR_RESERVED_IP` and test:

- ✅ Home page loads
- ✅ Dual CTA buttons work
- ✅ Features page loads
- ✅ About page loads
- ✅ Pricing page loads
- ✅ Demo page loads
- ✅ Submit JD form works
- ✅ Contact form works
- ✅ Mobile responsive

---

## Managing the Infrastructure

### View infrastructure state

```bash
cd terraform
tofu state list
tofu state show digitalocean_droplet.website
```

### SSH into droplet

```bash
# Using the output from terraform
ssh root@YOUR_RESERVED_IP

# Or directly
ssh root@123.45.67.90
```

### Monitor the app

```bash
# Once SSH'd into droplet
pm2 status
pm2 logs hirerevolution-website
pm2 restart hirerevolution-website
pm2 stop hirerevolution-website
pm2 start hirerevolution-website
```

### Update app code manually

```bash
# SSH into droplet
ssh root@YOUR_RESERVED_IP

# Update code
cd /var/www/hirerevolution-website
git pull origin main
npm run build
pm2 restart hirerevolution-website
```

Or just push to GitHub and let CI/CD do it!

### Destroy infrastructure (if needed)

```bash
cd terraform
tofu destroy
```

This will:
- ✅ Delete the droplet
- ✅ Delete the firewall
- ✅ Release the reserved IP
- ✅ Remove the SSH key from DigitalOcean

---

## Monitoring & Logs

### Application logs

```bash
# SSH into droplet
ssh root@YOUR_RESERVED_IP
pm2 logs hirerevolution-website -n 100  # Last 100 lines
```

### Nginx logs

```bash
ssh root@YOUR_RESERVED_IP
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### GitHub Actions logs

Visit GitHub repo → **Actions → [workflow run]** to see deployment logs

---

## DNS Swap (When Ready)

When the staging site is tested and approved:

1. Get your `reserved_ip` from Terraform output:
   ```bash
   cd terraform
   tofu output reserved_ip
   ```

2. Update your domain registrar (GoDaddy, Namecheap, etc.):
   ```
   A    hirerevolution.ai         YOUR_RESERVED_IP
   A    www.hirerevolution.ai     YOUR_RESERVED_IP
   ```

3. Wait 5–15 minutes for DNS propagation

4. Verify: `nslookup hirerevolution.ai` should return your reserved IP

5. Visit `https://hirerevolution.ai` — it's now live!

---

## SSL/HTTPS Setup (After DNS Swap)

Once DNS points to your droplet, SSH in and run:

```bash
ssh root@YOUR_RESERVED_IP

# Set up Nginx config for your domain
sudo tee /etc/nginx/sites-available/hirerevolution.ai > /dev/null <<'EOF'
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
EOF

# Enable Nginx config
sudo rm /etc/nginx/sites-enabled/default
sudo ln -s /etc/nginx/sites-available/hirerevolution.ai /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# Install Let's Encrypt certificate
sudo certbot --nginx -d hirerevolution.ai -d www.hirerevolution.ai

# Verify renewal works
sudo certbot renew --dry-run
```

Done! Certbot auto-renews every 90 days.

---

## Troubleshooting

### Site not loading?

```bash
ssh root@YOUR_RESERVED_IP

# Check app is running
pm2 status

# Check app logs
pm2 logs hirerevolution-website

# Check Nginx
sudo systemctl status nginx
sudo nginx -t

# Check firewall
sudo ufw status
```

### GitHub Actions deployment failed?

1. Check the workflow logs: GitHub repo → **Actions → [failed run]**
2. Common issues:
   - `STAGING_HOST` secret not set
   - `SSH_PRIVATE_KEY` secret not set
   - Droplet IP changed (use reserved IP instead)

### DNS not working?

```bash
# Check DNS from your computer
nslookup hirerevolution.ai
dig hirerevolution.ai

# Check from droplet
ssh root@YOUR_RESERVED_IP
nslookup hirerevolution.ai
```

### Stuck on deployment?

```bash
ssh root@YOUR_RESERVED_IP

# Check if app is running
pm2 status

# Check recent builds
ls -lh /var/www/hirerevolution-website/.next

# Check disk space
df -h

# Restart from scratch
cd /var/www/hirerevolution-website
pm2 delete hirerevolution-website
pm2 start ecosystem.config.js
```

---

## Cost

- **Droplet:** $6/month (1GB RAM, 25GB storage)
- **Reserved IP:** Included with droplet
- **SSL:** Free (Let's Encrypt)
- **Total:** ~$6/month

---

## Next Steps

1. ✅ Set up `terraform.tfvars`
2. ✅ Run `tofu apply`
3. ✅ Test at staging IP
4. ✅ Configure GitHub secrets
5. ✅ Make a test commit to GitHub
6. ✅ Verify CI/CD deployment works
7. ✅ Test all pages thoroughly
8. ✅ Update DNS when ready
9. ✅ Set up SSL
10. ✅ Go live!
