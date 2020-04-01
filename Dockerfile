FROM node:12.16.1-stretch

EXPOSE 3000

WORKDIR /home/node/app

RUN chown -R node /home/node/app

USER node

COPY package.json .
COPY package-lock.json .

RUN npm ci

ENV NODE_ENV production

COPY --chown=node . .

RUN npm run build

CMD ["node", "./node_modules/.bin/nuxt", "start"]
