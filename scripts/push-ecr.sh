#!/bin/bash

set -e

TAG="latest"
REPO="178537739852.dkr.ecr.us-east-1.amazonaws.com"
IMAGE="cobolt-monitor-engine"

aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin "$REPO/$IMAGE"

docker build --platform=linux/amd64 -t "$IMAGE:$TAG" .
docker tag "$IMAGE:$TAG" "$REPO/$IMAGE"
docker push "$REPO/$IMAGE"

