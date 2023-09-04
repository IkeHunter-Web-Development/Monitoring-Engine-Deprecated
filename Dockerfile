# STAGE 1: Setup
################################
FROM node:20-alpine3.17 AS setup
LABEL maintainer="web@ikehunter.dev"

COPY ./package.json /package.json

RUN npm install

# STAGE 2: Build
################################
FROM setup AS build

COPY ./src /src
EXPOSE 3000

CMD ["npm", "start"]



