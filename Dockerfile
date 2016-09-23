FROM node
MAINTAINER geocld

# Build app
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . /usr/src/app

RUN npm install --production

EXPOSE 1340
CMD [ "node","server.js"]
