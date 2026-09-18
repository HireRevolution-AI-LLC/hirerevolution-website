#!/bin/bash

# HireRevolution.ai Deployment Script
# Run on droplet after cloning repo

set -e

echo "🚀 Deploying HireRevolution.ai Website..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running on droplet
if ! command -v npm &> /dev/null; then
    echo -e "${RED}Error: Node.js not installed${NC}"
    echo "Run: curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && sudo apt-get install -y nodejs"
    exit 1
fi

echo -e "${YELLOW}Installing dependencies...${NC}"
npm install --omit=dev

echo -e "${YELLOW}Building Next.js...${NC}"
npm run build

if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}Installing PM2...${NC}"
    sudo npm install -g pm2
fi

echo -e "${YELLOW}Starting app with PM2...${NC}"
pm2 delete hirerevolution-website 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save

echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Setup Nginx reverse proxy (see DEPLOYMENT.md)"
echo "2. Setup SSL with Let's Encrypt"
echo "3. Point your domain to this droplet's IP"
echo ""
echo "Monitor the app:"
echo "  pm2 logs hirerevolution-website"
echo "  pm2 status"
