FROM node:4

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
COPY . /usr/src/app
RUN npm install --unsafe-perm=true

CMD [ "npm", "start" ]

EXPOSE 3000
