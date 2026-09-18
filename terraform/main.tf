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

# Existing account keys: infra-key (operator) and FE_ssh (the key GitHub Actions deploys with)
data "digitalocean_ssh_key" "authorized" {
  for_each = toset(var.ssh_key_names)
  name     = each.value
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
  ssh_keys           = [for k in data.digitalocean_ssh_key.authorized : k.id]

  tags = ["website", var.environment]

  user_data = templatefile("${path.module}/user_data.sh", {
    github_repo = "https://github.com/HireRevolution-AI-LLC/hirerevolution-website.git"
  })
}

# Create firewall
resource "digitalocean_firewall" "website" {
  name    = "hirerevolution-website-${var.environment}"
  droplet_ids = [digitalocean_droplet.website.id]

  inbound_rule {
    protocol         = "tcp"
    port_range       = "22"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  inbound_rule {
    protocol         = "tcp"
    port_range       = "80"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  inbound_rule {
    protocol         = "tcp"
    port_range       = "443"
    source_addresses = ["0.0.0.0/0", "::/0"]
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
