async function test(ctx) {
  ctx.state.data = {
    referer: ctx.headers.referer || '无',
    url: ctx.url
  }
}

module.exports = test
