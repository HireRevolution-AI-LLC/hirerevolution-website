# Deploy Now — 5 Step Checklist

## ✅ Step 1: Get DigitalOcean API Token

1. Visit: https://cloud.digitalocean.com/account/api/tokens
2. Click **Generate New Token**
3. Name: `hirerevolution-website`
4. Scope: **Read and Write**
5. Copy token (starts with `dop_v1_`)

---

## ✅ Step 2: Create terraform.tfvars

```bash
cd ~/PycharmProjects/hr-marketing-website/terraform
cp terraform.tfvars.example terraform.tfvars
```

Edit `terraform.tfvars`:

```hcl
do_token       = "dop_v1_YOUR_TOKEN"
ssh_public_key = "ssh-ed25519 AAAAC3NzaC1..." # From: cat ~/.ssh/id_ed25519.pub
```

Save and close.

---

## ✅ Step 3: Deploy Infrastructure

```bash
cd ~/PycharmProjects/hr-marketing-website/terraform

# Install OpenTofu if needed
brew install opentofu

# Deploy
tofu init
tofu apply
```

When prompted, type: `yes`

**Save the output!** You'll need:
- `reserved_ip` (for GitHub secrets and DNS)
- `droplet_ip` (for initial testing)

---

## ✅ Step 4: Add GitHub Secrets

1. Go to GitHub repo: https://github.com/HireRevolution-AI-LLC/hirerevolution-website
2. **Settings → Secrets and variables → Actions**
3. Click **New repository secret**

Add two secrets:

| Name | Value |
|------|-------|
| `STAGING_HOST` | Your `reserved_ip` from Step 3 |
| `SSH_PRIVATE_KEY` | Contents of `cat ~/.ssh/id_ed25519` |

---

## ✅ Step 5: Test

Wait 2-3 minutes for the droplet to finish setup, then visit:

```
http://YOUR_DROPLET_IP
```

You should see the homepage!

**Test SSH:**
```bash
ssh root@YOUR_DROPLET_IP
pm2 status  # Should show hirerevolution-website: online
```

---

## ✅ Next: Test & Iterate

### Make a test change
```bash
# In the website repo
echo "Testing CI/CD" >> README.md
git add README.md
git commit -m "Test CI/CD"
git push origin main
```

### Watch deployment
- Go to GitHub → **Actions**
- Click the workflow run
- After ~1 min, refresh `http://YOUR_RESERVED_IP` to see changes

### Test all pages
- [ ] Home page
- [ ] Dual CTA buttons
- [ ] Features page
- [ ] About page
- [ ] Pricing page
- [ ] Demo form
- [ ] Submit JD form
- [ ] Contact form
- [ ] Mobile responsive

### Monitor app
```bash
ssh root@YOUR_DROPLET_IP
pm2 logs hirerevolution-website  # Watch live logs
```

---

## ✅ When Ready: Swap DNS

Update your domain registrar:

```
A    hirerevolution.ai         YOUR_RESERVED_IP
A    www.hirerevolution.ai     YOUR_RESERVED_IP
```

Wait 5–15 minutes, then visit: `https://hirerevolution.ai`

---

## 📚 Full Docs

- **Infrastructure Guide:** `INFRASTRUCTURE.md`
- **Deployment Reference:** `DEPLOYMENT.md`
- **Quick Start:** `QUICK_START.md`

---

## 🆘 Help

If anything fails:

1. **Check Terraform state:** `cd terraform && tofu state list`
2. **View app logs:** `ssh root@YOUR_DROPLET_IP && pm2 logs hirerevolution-website`
3. **Check GitHub Actions:** GitHub repo → Actions → [failed workflow]
4. **SSH debug:** `ssh root@YOUR_DROPLET_IP` and explore `/var/www/hirerevolution-website`

---

**Ready? Start with Step 1!** 🚀
