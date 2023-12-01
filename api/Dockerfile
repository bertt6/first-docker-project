FROM node:19.9.0-alpine

WORKDIR /app

RUN npm install -g @nestjs/cli

RUN npm install --save @nestjs/typeorm typeorm

COPY ./* /app/

RUN chmod +x /app/script.sh

CMD [ "./script.sh" ]