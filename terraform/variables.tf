variable "do_token" {
  description = "DigitalOcean API token"
  type        = string
  sensitive   = true
}

variable "ssh_key_names" {
  description = "Names of SSH keys already in the DigitalOcean account to authorize on the droplet"
  type        = list(string)
  default     = ["infra-key", "FE_ssh"]
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
