const sendError = require('../utils/sendError')

module.exports = async function (ctx, next) {
  const start = Date.now()
  try {
    await next()
    const { code, data = {}, info, error } = ctx.state
    ctx.body = ctx.body || {
      success: !code,
      data,
      time: `${Date.now() - start}ms`,
      info: info || error || '成功',
    }
  } catch (e) {
    // catch 住全局的错误信息
    console.error('Catch Error: %o', e)
    const info = e && e.message ? e.message : e.toString()

    if (e.status) ctx.status = e.status

    ctx.body = {
      success: false,
      time: `${Date.now() - start}ms`,
      info: info || '未知错误',
    }

    // 发送错误报告
    if (ctx.status !== 401 || ctx.status !== 403) {
      sendError(`${ctx.status || ''}错误：${info}\n来源：${ctx.headers.referer}\n接口：${ctx.url}`)
    }
  }
}
