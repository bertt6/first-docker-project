FROM node:14

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
RUN npm install axios cheerio pg

COPY . .

VOLUME fiyatlar.txt:./usr/src/app/fiyatlar.txt

EXPOSE 3030


CMD ["npx", "nodemon", "app.js