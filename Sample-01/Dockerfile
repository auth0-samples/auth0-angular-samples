FROM node:10-alpine AS build

RUN apk update && apk add git

RUN mkdir -p /app

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

# -----------------

FROM node:10-alpine

RUN mkdir -p /app

WORKDIR /app

COPY package.json .

RUN npm install --production

COPY --from=build ./app/dist/login-demo ./dist/login-demo/
COPY ./server.js .
COPY ./auth_config.json .

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "server.js"]
