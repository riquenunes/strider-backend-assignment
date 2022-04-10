FROM node:16.14-alpine

WORKDIR /app
ADD package.json .
ADD package-lock.json .
RUN npm install
ADD . .
RUN npm run build

USER node

CMD ["node", "dist/server/index.js"]
