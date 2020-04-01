const mime = require('mime')
const slug = require('slug')
const soulsearch = require('../lib/soulsearch-client')

const slsk = soulsearch({
  user: process.env.SLSK_USER,
  pass: process.env.SLSK_PASS,
  extensions: ['mp3', 'm4a', 'ogg', 'flac', 'wav', 'aiff']
})

exports.search = async (ctx) => {
  const { query } = ctx.query

  function onFolder (data) {
    return ctx.sse.send({
      event: 'folder',
      data: JSON.stringify(data)
    })
  }

  function onDone (data) {
    ctx.sse.send({
      event: 'done',
      data: JSON.stringify(data)
    })
    return ctx.sse.end()
  }

  function onError (err) {
    ctx.sse.end()
    return ctx.throw(500, err.message)
  }

  if (!query || !query.trim().length) {
    return ctx.throw(400, 'Query not defined.')
  }

  const search = await slsk.search(slug(query, ' '), {
    timeout: 5000,
    limit: 100
  })

  search.on('folder', onFolder)
  search.on('done', onDone)
  search.on('error', onError)

  ctx.body = ''
}

exports.download = async (ctx) => {
  if (!ctx.query.user) {
    return ctx.throw(400, 'User not specified.')
  }

  if (!ctx.query.file) {
    return ctx.throw(400, 'File not specified.')
  }

  const data = {
    file: ctx.query.file,
    user: ctx.query.user
  }

  const stream = await slsk.download(data)

  ctx.set('content-type', mime.getType(data.file))
  ctx.body = stream
}
