# Common build stage
FROM node:14.14.0-alpine3.12 as common-build-stage

WORKDIR /usr/src/app/scanner_module

COPY package.json ./
COPY package-lock.json ./
COPY ./ ./

RUN npm install

EXPOSE 3001

# Dvelopment build stage
FROM common-build-stage as development-build-stage

RUN chmod +x /usr/src/app/scanner_module/docker-entrypoint.sh

ENTRYPOINT [ "docker-entrypoint.sh" ]

ENV NODE_ENV development

CMD ["npm", "run", "dev"]

# Production build stage
FROM common-build-stage as production-build-stage

ENV NODE_ENV production

CMD ["npm", "run", "start"]
