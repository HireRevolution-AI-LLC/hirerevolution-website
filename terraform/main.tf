terraform {
  required_version = ">= 1.0"
  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "~> 2.0"
    }
  }
}

provider "digitalocean" {
  token = var.do_token
}

# Existing account keys for operator access: infra-key (~/.ssh/id_ed25519_infra) and FE_ssh (~/.ssh/id_ed25519)
data "digitalocean_ssh_key" "authorized" {
  for_each = toset(var.ssh_key_names)
  name     = each.value
}

# Passphrase-less key used only by GitHub Actions (its private half is the SSH_PRIVATE_KEY repo secret)
resource "digitalocean_ssh_key" "deploy" {
  name       = "hirerevolution-website-deploy"
  public_key = file(pathexpand(var.deploy_public_key_path))
}

# Create droplet using existing SSH key
resource "digitalocean_droplet" "website" {
  image              = "ubuntu-22-04-x64"
  name               = var.droplet_name
  region             = var.droplet_region
  size               = var.droplet_size
  backups            = false
  ipv6               = true
  monitoring         = true
  ssh_keys           = concat([for k in data.digitalocean_ssh_key.authorized : k.id], [digitalocean_ssh_key.deploy.id])

  tags = ["website", var.environment]

  user_data = templatefile("${path.module}/user_data.sh", {
    github_repo = "https://github.com/HireRevolution-AI-LLC/hirerevolution-website.git"
    site_domain = var.site_domain
  })

  # user_data runs once, at first boot, so editing user_data.sh changes
  # nothing on a running droplet -- but without this, OpenTofu treats the edit
  # as grounds to destroy and recreate it. That happened silently on
  # 2026-09-21 (the deploy-user change): from then until this line, *any*
  # apply here, even one meant only for the firewall, planned to wipe the
  # live site's server. Rebuild deliberately with `tofu apply -replace=...`.
  lifecycle {
    ignore_changes = [user_data]
  }
}

# Cloudflare's edge ranges, from https://www.cloudflare.com/ips/ (fetched
# 2026-09-24). The apex and www are proxied, so these are the only addresses a
# real visitor's request reaches the droplet from. Cloudflare changes this list
# rarely but does change it; re-check it before any apply that touches the
# firewall. A range missing here means Cloudflare 522s from that edge.
locals {
  cloudflare_ips = [
    "173.245.48.0/20", "103.21.244.0/22", "103.22.200.0/22", "103.31.4.0/22",
    "141.101.64.0/18", "108.162.192.0/18", "190.93.240.0/20", "188.114.96.0/20",
    "197.234.240.0/22", "198.41.128.0/17", "162.158.0.0/15", "104.16.0.0/13",
    "104.24.0.0/14", "172.64.0.0/13", "131.0.72.0/22",
    "2400:cb00::/32", "2606:4700::/32", "2803:f800::/32", "2405:b500::/32",
    "2405:8100::/32", "2a06:98c0::/29", "2c0f:f248::/32",
  ]
}

# Create firewall
resource "digitalocean_firewall" "website" {
  name    = "hirerevolution-website-${var.environment}"
  droplet_ids = [digitalocean_droplet.website.id]

  # SSH stays open to everyone: GitHub Actions deploys over it from addresses
  # that cannot be listed here. Keys only, no passwords, no root password.
  inbound_rule {
    protocol         = "tcp"
    port_range       = "22"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  # Web traffic only from Cloudflare. Without this, anyone could skip the WAF
  # by sending a Host: header straight to the reserved IP, and write whatever
  # they liked into X-Forwarded-For -- which the per-IP rate limits and
  # Turnstile's remoteip both trust.
  inbound_rule {
    protocol         = "tcp"
    port_range       = "80"
    source_addresses = local.cloudflare_ips
  }

  inbound_rule {
    protocol         = "tcp"
    port_range       = "443"
    source_addresses = local.cloudflare_ips
  }

  outbound_rule {
    protocol              = "tcp"
    port_range            = "1-65535"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }

  outbound_rule {
    protocol              = "udp"
    port_range            = "1-65535"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }
}

# Reserved IP
resource "digitalocean_reserved_ip" "website" {
  region = var.droplet_region
}

# Assign reserved IP
resource "digitalocean_reserved_ip_assignment" "website" {
  ip_address = digitalocean_reserved_ip.website.ip_address
  droplet_id = digitalocean_droplet.website.id
}
