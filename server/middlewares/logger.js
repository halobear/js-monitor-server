const chalk = require('chalk')

function log(...args) {
  console.log(args.join(' '))
}

function getTimeStr(now) {
  const M = now.getMonth()
  const D = now.getDate()
  const h = now.getHours()
  const m = now.getMinutes()
  const s = now.getSeconds()
  const format = (a) => (a > 9 ? a : `0${a}`)
  const str = `${format(M)}-${format(D)} ${format(h)}:${format(m)}:${format(s)}`
  return chalk.gray(str)
}

module.exports = async (ctx, next) => {
  const method = chalk.bold.gray(ctx.method)
  const now = new Date()
  const startTime = getTimeStr(now)
  log(method, ctx.originalUrl, startTime)
  await next()
  const durationTime = Date.now() - now.getTime()
  log(method, ctx.path, chalk.yellow(ctx.status), `${chalk.green(durationTime)}${chalk.gray('ms')}`)
}
