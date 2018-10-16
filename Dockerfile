FROM node:8-alpine

WORKDIR /usr/src/k3kchan

COPY package*.json ./

RUN npm install

COPY . .

CMD [ "npm", "start" ]