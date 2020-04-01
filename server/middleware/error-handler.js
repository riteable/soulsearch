module.exports = () => {
  return async (ctx, next) => {
    try {
      await next()
    } catch (err) {
      const status = err.status || 500
      const message = err.message || 'Internal Server Error'
      const body = { status, message }

      ctx.status = status
      ctx.body = body
      return ctx.app.emit('error', err, ctx)
    }
  }
}
