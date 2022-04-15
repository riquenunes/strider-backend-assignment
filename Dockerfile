FROM node:16-alpine

WORKDIR /app
ADD . .
RUN npm install

CMD [ "npm", "start" ]
