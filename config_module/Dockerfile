FROM node:alpine
WORKDIR /usr/src/app/config_module
COPY package.json ./
COPY package-lock.json ./
COPY ./ ./
ENV NODE_OPTIONS=--openssl-legacy-provider
RUN npm install
EXPOSE 3000
CMD ["npm", "run", "start"]
