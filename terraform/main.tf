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

# Upload SSH key
resource "digitalocean_ssh_key" "main" {
  name       = var.ssh_key_name
  public_key = var.ssh_public_key
}

# Create droplet
resource "digitalocean_droplet" "website" {
  image              = "ubuntu-22-04-x64"
  name               = var.droplet_name
  region             = var.droplet_region
  size               = var.droplet_size
  backups            = false
  ipv6               = true
  private_networking = false
  monitoring         = true
  ssh_keys           = [digitalocean_ssh_key.main.fingerprint]

  tags = ["website", var.environment]

  # User data script to install Docker and deploy app
  user_data = base64encode(templatefile("${path.module}/user_data.sh", {
    github_repo = "https://github.com/HireRevolution-AI-LLC/hirerevolution-website.git"
  }))
}

# Create firewall
resource "digitalocean_firewall" "website" {
  name    = "hirerevolution-website-${var.environment}"
  droplet_ids = [digitalocean_droplet.website.id]

  # Allow SSH
  inbound_rule {
    protocol         = "tcp"
    port_range       = "22"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  # Allow HTTP
  inbound_rule {
    protocol         = "tcp"
    port_range       = "80"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  # Allow HTTPS
  inbound_rule {
    protocol         = "tcp"
    port_range       = "443"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  # Allow all outbound
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

# Create a reserved IP (so we can easily swap droplets later)
resource "digitalocean_reserved_ip" "website" {
  region = var.droplet_region
}

# Assign reserved IP to droplet
resource "digitalocean_reserved_ip_assignment" "website" {
  ip_address = digitalocean_reserved_ip.website.ip_address
  droplet_id = digitalocean_droplet.website.id
}
