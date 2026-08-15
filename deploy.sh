#!/bin/bash
#
# Official script to build an image of kentra-keycloak and upload to Nexus

# Load environment variables from .env file
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
else
    echo "Error: .env file not found."
    exit 1
fi

# Check required environment variables
if [ -z "$CONTAINER_NAME" ] || [ -z "$DOCKER_HUB_URL" ] || [ -z "$DOCKER_HUB_PATH" ]; then
    echo "Error: Required environment variables (CONTAINER_NAME, NEXUS_URL, NEXUS_PATH) are missing."
    exit 1
fi

# Check if an argument is provided
if [ $# -eq 0 ]; then
    echo "Error: image version is required."
    echo "Usage: $0 <imageVersion>"
    exit 1
fi

# Use the argument as the image base version
imageVersion="$1"

imageTag="${DOCKER_HUB_URL}/${DOCKER_HUB_PATH}/${CONTAINER_NAME}:${imageVersion}"

echo "Image: ${imageTag}"

echo "$(uname -m)"

# Build Docker image based on architecture
if [ "$(uname -m)" = "arm64" ]; then
    docker buildx build --platform linux/amd64 -t ${CONTAINER_NAME}:${imageVersion} --load .
else
    docker build -t ${CONTAINER_NAME}:${imageVersion} .
fi

# Tag, push, and remove Docker image
docker tag ${CONTAINER_NAME}:${imageVersion} ${imageTag}
docker push ${imageTag}
docker image rm ${CONTAINER_NAME}:${imageVersion} ${imageTag}
