const ding = require('./ding')

const isProd = process.env.NODE_ENV === 'production'

module.exports = (text) => {
  if (!isProd) return
  return ding.sendCard({
    title: `js监控服务异常`,
    text: `### js监控服务异常 \n${text}`,
  })
}
