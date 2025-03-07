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


tango_conf_filename="tango.config.py"
raw_url="https://raw.githubusercontent.com/$owner/$repo/$branch/$tango_conf_filename"

echo "Downloading $tango_conf_filename from $owner/$repo (branch: $branch) to $tango_conf_filename"

if curl -sSL "$raw_url" -o "$tango_conf_filename"; then
  echo "Download successful!"
else
  echo "Download failed. Check the repository, branch, and file path."
  exit 1
fi


# Create the 'tango_files' directory if it doesn't exist
mkdir -p tango_files

# Get the absolute path of the 'tango_files' directory
absolute_path=$(realpath tango_files)

docker_compose_file="docker-compose.yml"

if [ ! -f "$docker_compose_file" ]; then
  echo "Error: Docker Compose file '$docker_compose_file' not found."
  exit 1
fi

# 5. Use sed to replace the placeholder with the absolute path
if sed -i "s|DOCKER_TANGO_HOST_VOLUME_PATH=.*|DOCKER_TANGO_HOST_VOLUME_PATH=$absolute_path|" "$docker_compose_file"; then
  echo "Successfully updated $docker_compose_file with path: $absolute_path"
else
  echo "Error: Failed to update $docker_compose_file."
  exit 1
fi

docker compose up

exit 0

