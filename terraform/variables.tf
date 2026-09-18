variable "do_token" {
  description = "DigitalOcean API token"
  type        = string
  sensitive   = true
}

variable "ssh_key_name" {
  description = "Name of SSH key in DigitalOcean"
  type        = string
  default     = "hirerevolution-main"
}

variable "ssh_public_key" {
  description = "SSH public key content"
  type        = string
  sensitive   = true
}

variable "droplet_name" {
  description = "Droplet name"
  type        = string
  default     = "hirerevolution-website-staging"
}

variable "droplet_region" {
  description = "DigitalOcean region"
  type        = string
  default     = "nyc3"
}

variable "droplet_size" {
  description = "Droplet size slug"
  type        = string
  default     = "s-1vcpu-1gb"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "staging"
}

variable "app_port" {
  description = "Application port"
  type        = number
  default     = 3000
}
