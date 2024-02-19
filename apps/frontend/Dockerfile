FROM node:20.9.0-alpine3.18 as builder

WORKDIR /var/www/app

COPY ./package*.json ./
RUN npm ci
COPY . ./
