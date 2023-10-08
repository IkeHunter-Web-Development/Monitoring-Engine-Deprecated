# STAGE 1: Setup
################################
# FROM node:20-alpine3.17 AS setup
FROM node:20.8-buster AS setup
LABEL maintainer="web@ikehunter.dev"

# ENV GENERATE_SOURCEMAP=false
# WORKDIR /app

# ARG NODE_ENV=production

COPY ./package.json /package.json
# COPY ./package-lock.json /package-lock.json
COPY ./tsconfig.json /tsconfig.json
COPY ./jest.config.ts /jest.config.ts

COPY ./src /src

USER root

RUN apt-get update && \
    apt-get -y install sudo && \
    sudo apt-get install gnupg curl && \
    curl -fsSL https://pgp.mongodb.com/server-7.0.asc | \
    sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg \
    --dearmor && \
    echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] http://repo.mongodb.org/apt/debian bullseye/mongodb-org/7.0 main" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
    # sudo apt-get install -y mongodb-org




RUN npm install -g mongodb && \
    npm install -g typescript && \
    npm install -g rimraf && \
    npm install 

# # STAGE 2: Build
# ################################
# FROM setup AS build

EXPOSE 8000

RUN npm run build

VOLUME "/logs"

CMD ["npm", "start"]



