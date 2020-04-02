# Soulsearch

A simple web UI and API based on the Soulseek protocol.

## Development

If you're planning to customize the source code, follow these steps first:

**1.** Install Node.js dependencies

```
$ npm install
```

**2.** Copy `.env.example` to `.env` and edit the variables.

```
$ cp .env.example .env
```

**3.** Run development server

```
$ npm run dev
```

## Production

First make sure your `.env` variables are set properly, most importantly the following:

```
NODE_ENV=production
VIRTUAL_HOST=yourdomain.com
LETSENCRYPT_HOST=yourdomain.com
LETSENCRYPT_EMAIL=email@yourdomain.com
API_URL_BROWSER=https://yourdomain.com/api
SLSK_USER=uniqueusername
SLSK_PASS=somepassword
```

To run the application in production there are a couple of options. The easiest are the Docker options, but you need to have [Docker](https://docs.docker.com/get-started) and [Docker Compose](https://docs.docker.com/compose/install) installed.

**Option 1:** Docker Compose

```
$ docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

**Option 2:** Docker Swarm mode

If you haven't enabled [Swarm mode](https://docs.docker.com/engine/swarm/), you can run:

```
$ docker swarm init
```

If Swarm mode is enabled successfully, you can run your stack as follows:

```
$ docker-compose -f docker-compose.yml -f docker-compose.prod.yml -f docker-compose.swarm.yml config | docker stack deploy -c - <YOUR-STACK-NAME>
```


**Option 3:** PM2

First make sure the app is built for production:

```
$ npm run build
```

Then, you need to have [PM2](https://pm2.keymetrics.io/) installed globally to run the following:

```
$ pm2 start pm2.config.js --env production
```

Also, for this option you need to configure your own proxy (e.g. Nginx) to forward the requests to your app.
