# STAGE 1: Setup
################################
FROM node:20-alpine3.17 AS setup
LABEL maintainer="web@ikehunter.dev"

ENV GENERATE_SOURCEMAP=false

COPY ./package.json /package.json

RUN npm install && npm install -g nodemon

# STAGE 2: Build
################################
FROM setup AS build

COPY ./src /src
EXPOSE 8000

VOLUME "/logs"

CMD ["npm", "start"]



