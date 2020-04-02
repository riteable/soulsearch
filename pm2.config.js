require('dotenv').config()

module.exports = {
  apps: [{
    name: process.env.APP_NAME,
    script: './server/index.js',
    watch: true,
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }]
}
