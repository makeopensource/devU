#!/bin/bash

# ---------------------------------------------------------------------------
# DevU Installation Script
# Sets up a devU install using prebuilt images and configures tango
# ---------------------------------------------------------------------------

# Text colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# ---------------------------------------------------------------------------
# Configuration Parameters
# ---------------------------------------------------------------------------

owner="${1:-makeopensource}"  # Default to makeopensource if not provided
branch="${2:-develop}"        # Default to develop if not provided
repo="devU"

# ---------------------------------------------------------------------------
# Display Header
# ---------------------------------------------------------------------------

echo -e "\n${BOLD}${BLUE}=====================================================${NC}"
echo -e "${BOLD}${BLUE}           DevU Installation Script                  ${NC}"
echo -e "${BOLD}${BLUE}=====================================================${NC}\n"

echo -e "${CYAN}Using configuration:${NC}"
echo -e "  ${BOLD}Owner:${NC}  ${GREEN}$owner${NC}"
echo -e "  ${BOLD}Branch:${NC} ${GREEN}$branch${NC}"
echo -e "  ${BOLD}Repo:${NC}   ${GREEN}$repo${NC}\n"

# ---------------------------------------------------------------------------
# Download Docker Compose File
# ---------------------------------------------------------------------------

compose_file_path="example-docker-compose.yml"
compose_local_filename="docker-compose.yml"
raw_url="https://raw.githubusercontent.com/$owner/$repo/$branch/$compose_file_path"

echo -e "${CYAN}Downloading compose file...${NC}"
echo -e "  From: ${YELLOW}$raw_url${NC}"
echo -e "  To:   ${YELLOW}$compose_local_filename${NC}\n"

if curl -sSL "$raw_url" -o "$compose_local_filename"; then
  echo -e "${GREEN}✓ Download successful!${NC}\n"
else
  echo -e "${RED}✗ Download failed. Check the repository, branch, and file path.${NC}\n"
  exit 1
fi

# ---------------------------------------------------------------------------
# Configure Environment
# ---------------------------------------------------------------------------

echo -e "${BOLD}${PURPLE}Configuration Setup${NC}\n"

# Prompt for URLs
echo -e "${CYAN}Enter the URLs:${NC}"
echo -en "  Frontend URL (e.g., https://devu.app): "
read -e client_url
echo ""

echo -en "  API URL (e.g., https://api.devu.app): "
read -e api_url
echo ""

# Prompt for port configuration
echo -e "${CYAN}Configure ports:${NC}"
echo -en "  API port (default: 3001): "
read -e api_port
api_port=${api_port:-3001}
echo ""

echo -en "  Client port (default: 9000): "
read -e client_port
client_port=${client_port:-9000}
echo ""

# ---------------------------------------------------------------------------
# Watchtower Configuration
# ---------------------------------------------------------------------------

echo -e "${CYAN}Auto-update configuration:${NC}"
echo -en "  Enable watchtower auto-update service? (y/N): "
read -e use_watchtower
use_watchtower=${use_watchtower:-"n"}  # Default to "n" if empty
use_watchtower=${use_watchtower,,}     # Convert to lowercase
echo ""

if [[ "$use_watchtower" == "y" || "$use_watchtower" == "yes" ]]; then
  # Ask for check interval (in seconds)
  echo -en "  Enter watchtower check interval in seconds (default: 900): "
  read -e watchtower_interval
  watchtower_interval=${watchtower_interval:-900}
  echo ""

  # Update the watchtower check interval
  sed -i "s|WATCHTOWER_POLL_INTERVAL=900|WATCHTOWER_POLL_INTERVAL=$watchtower_interval|g" "$compose_local_filename"

  echo -e "  ${GREEN}✓ Watchtower enabled${NC} with check interval: ${BOLD}$watchtower_interval seconds${NC}\n"
else
  # Comment out the watchtower service in the docker-compose file
  sed -i '/watchtower:/,/restart: unless-stopped/s/^/# /' "$compose_local_filename"
  echo -e "  ${YELLOW}✗ Watchtower service disabled${NC}\n"
fi

# ---------------------------------------------------------------------------
# Update Docker Compose File
# ---------------------------------------------------------------------------

echo -e "${CYAN}Updating Docker Compose file...${NC}"

# Use sed to replace the placeholder URLs in the docker-compose file
sed -i "s|CLIENT_URL: https://devu.app|CLIENT_URL: $client_url|g" "$compose_local_filename"
sed -i "s|API_URL: https://api.devu.app|API_URL: $api_url|g" "$compose_local_filename"

# Update the port mappings
sed -i "s|      - '3001:3001'|      - '$api_port:3001'|g" "$compose_local_filename"
sed -i "s|      - '9000:80'|      - '$client_port:80'|g" "$compose_local_filename"

# ---------------------------------------------------------------------------
# Display Configuration Summary
# ---------------------------------------------------------------------------

echo -e "\n${BOLD}${BLUE}Configuration Summary:${NC}"
echo -e "  ${BOLD}Client URL:${NC}   ${GREEN}$client_url${NC}"
echo -e "  ${BOLD}API URL:${NC}      ${GREEN}$api_url${NC}"
echo -e "  ${BOLD}API Port:${NC}     ${GREEN}$api_port${NC}"
echo -e "  ${BOLD}Client Port:${NC}  ${GREEN}$client_port${NC}\n"

# ---------------------------------------------------------------------------
# Start Containers
# ---------------------------------------------------------------------------

echo -e "${BOLD}${PURPLE}Starting containers...${NC}\n"
docker compose up -d

echo -e "\n${BOLD}${GREEN}✓ Setup complete!${NC}\n"

exit 0