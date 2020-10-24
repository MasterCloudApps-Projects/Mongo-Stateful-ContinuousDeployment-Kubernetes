FROM node:12-alpine3.12

LABEL maintainer="Francisco Franco <francisco.franco@ethcero.es>"

# Create app directory
WORKDIR /usr/src/app

ENV NODE_PATH /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install --production

# Bundle app source
COPY src .

EXPOSE 3000

CMD node app.js --prod