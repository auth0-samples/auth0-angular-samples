FROM node:8.7-alpine

RUN npm install -g @angular/cli

WORKDIR /home/app/sso-app-one

ADD sso-app-one/package.json /home/app/sso-app-one
RUN npm install

WORKDIR /home/app/sso-app-two

ADD sso-app-two/package.json /home/app/sso-app-two
RUN npm install

WORKDIR /home/app

ADD package.json /home/app
RUN npm install

ADD . /home/app

CMD ["npm", "start"]

EXPOSE 3000 3001 3002 3003
