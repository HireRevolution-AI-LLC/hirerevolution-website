output "droplet_id" {
  description = "Droplet ID"
  value       = digitalocean_droplet.website.id
}

output "droplet_ip" {
  description = "Droplet public IP address"
  value       = digitalocean_droplet.website.ipv4_address
}

output "droplet_ipv6" {
  description = "Droplet IPv6 address"
  value       = digitalocean_droplet.website.ipv6_address
}

output "reserved_ip" {
  description = "Reserved IP address (use for DNS)"
  value       = digitalocean_reserved_ip.website.ip_address
}

output "ssh_command" {
  description = "SSH command to connect to droplet"
  value       = "ssh root@${digitalocean_droplet.website.ipv4_address}"
}

output "website_url" {
  description = "Website URL (via droplet IP)"
  value       = "http://${digitalocean_droplet.website.ipv4_address}"
}

output "status" {
  description = "Deployment status"
  value       = "✅ Droplet created. App is deploying (may take 2-3 minutes). Visit http://${digitalocean_droplet.website.ipv4_address} to test."
}
