FROM node:20-alpine

WORKDIR /apps

COPY package*.json yarn.lock ./

RUN yarn install

COPY . .

CMD ["sh","-c","yarn start:dev" ]