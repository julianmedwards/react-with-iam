ARG NODE_VERSION
FROM node:$NODE_VERSION

ARG NODE_ENV
ENV NODE_ENV=$NODE_ENV

ARG DATABASE_HOST
ENV DATABASE_HOST=$DATABASE_HOST

ARG DATABASE_PASSWORD
ENV DATABASE_PASSWORD=$DATABASE_PASSWORD

ARG PORT
ENV PORT=$PORT

WORKDIR /usr/src/app

COPY server/package.json ./

RUN npm install

COPY server/dist ./
COPY server/bin ./bin
COPY server/views ./views
COPY server/public ./public
COPY client/dist/ ./dist

CMD [ "node", "server.js" ]