FROM node
MAINTAINER geocld

# Build app
RUN npm install -g pm2
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . /usr/src/app

RUN npm install --production

EXPOSE 1340
# CMD [ "node","server.js"]
ENTRYPOINT pm2 start server.js
