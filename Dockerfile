# STAGE 1: Setup
################################
FROM node:20-bookworm AS setup
LABEL maintainer="web@ikehunter.dev"

WORKDIR /app

COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
COPY ./tsconfig.json ./tsconfig.json
COPY ./jest.config.ts ./jest.config.ts

USER root

RUN npm install npm@^10.2.1 && \
    npm install -g typescript && \
    npm install -g rimraf && \
    npm install 

# STAGE 2: Build
################################
FROM setup AS build

EXPOSE 8000

COPY ./src ./src

RUN npm run build

VOLUME "/app/logs"

CMD ["npm", "start"]



