#!/bin/sh

cd app

apk add git

git clone https://github.com/nestjs/typescript-starter.git project

mv project/* .

rm -rf project

npm install

npm install --save @nest/typeorm typeorm pg

npm run start:dev