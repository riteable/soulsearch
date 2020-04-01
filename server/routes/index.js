const Router = require('koa-router')
const sse = require('koa-sse-stream')
const searchController = require('../controllers/search-controller')

const router = new Router({
  prefix: '/api'
})

router.get('/search', sse(), searchController.search)
router.get('/download', searchController.download)

module.exports = router
