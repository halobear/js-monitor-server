const ding = require('./ding')

module.exports = (text) => {
  return ding.sendCard({
    title: `js监控服务异常`,
    text: `### js监控服务异常 \n${text}`,
  })
}
