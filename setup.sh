#!/bin/bash

# setup a devU install using the prebuilt images
# also sets up the required tango config

owner="$1"
branch="$2"

if [ -z "$owner" ] || [ -z "$branch" ]; then
  echo "Usage: $0 <owner> <branch>"
  echo "Example: $0 makeopensource develop"
  exit 1
fi

repo="devU"

compose_file_path="example-docker-compose.yml"
compose_local_filename="docker-compose.yml"
raw_url="https://raw.githubusercontent.com/$owner/$repo/$branch/$compose_file_path"

echo "Downloading $compose_file_path from $owner/$repo (branch: $branch) to $compose_local_filename"

if curl -sSL "$raw_url" -o "$compose_local_filename"; then
  echo "Download successful!"
else
  echo "Download failed. Check the repository, branch, and file path."
  exit 1
fi

docker_compose_file="docker-compose.yml"

if [ ! -f "$docker_compose_file" ]; then
  echo "Error: Docker Compose file '$docker_compose_file' not found."
  exit 1
fi

docker compose up

exit 0

