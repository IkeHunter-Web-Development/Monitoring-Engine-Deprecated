# STAGE 1: Setup
################################
FROM node:20-alpine3.17 AS setup
LABEL maintainer="web@ikehunter.dev"

COPY ./package.json /package.json
COPY ./tsconfig.json /tsconfig.json
COPY ./jest.config.ts /jest.config.ts

USER root

RUN npm install -g typescript && \
    npm install -g rimraf && \
    npm install 

# STAGE 2: Build
################################
FROM setup AS build

EXPOSE 8000

COPY ./src /src

RUN npm run swagger-autogen && \
    npm run build

VOLUME "/logs"

CMD ["npm", "start"]



