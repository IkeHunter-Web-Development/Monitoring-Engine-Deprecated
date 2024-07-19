#!/bin/bash

set -e

SVC="monitor-engine"
TAG="latest"
REPO="178537739852.dkr.ecr.us-east-2.amazonaws.com"

aws ecr get-login-password --region us-east-2 | docker login --username AWS --password-stdin 178537739852.dkr.ecr.us-east-2.amazonaws.com/core-engine

docker build --platform=linux/amd64 -t "$SVC:$TAG" .
docker tag "$SVC:$TAG" "$REPO/$SVC"
docker push "$REPO/$SVC"

