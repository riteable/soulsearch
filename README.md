# Soulsearch

A simple web UI and API based on the Soulseek protocol.

## Install

```
$ npm install
```

## Development

```
$ npm run dev
```

## Production

**Option 1** - Docker Compose

```
$ docker-compose -f docker-compose.yml -f docker-compose.prod.yml up
```

**Option 2** - Docker Swarm mode

```
$ docker-compose -f docker-compose.yml -f docker-compose.prod.yml config | docker stack deploy -c - <YOUR-STACK-NAME>
```

**Option 3** - PM2

```
$ pm2 start pm2.json
```
