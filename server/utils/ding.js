/*
 * @Description: 钉钉发送模板消息推送
 * @Date: 2019-06-12 13:21:39
 * @LastEditTime: 2020-08-22 13:08:50
 */
const Ding = require('@luzhongk/node-ding')
const { ding: options } = require('../constants/config')

const ding = new Ding({
  access_token: options.access_token,
  secret: options.secret,
})

/**
 * @description:自定义发送
 * @param {data} Object
 * @return:
 */
async function send(data) {
  return ding.send(data)
}

/**
 * @description: 发送markdown
 * @param {type}
 * @return:
 */
async function sendMarkdown({ title, text }) {
  const data = {
    msgtype: 'markdown',
    markdown: {
      title,
      text: `### ${title}\n${text}`,
    },
  }
  return send(data)
}

/**
 * @description: 发送卡片类型
 * @param {type} Object
 * @return:
 */
function sendCard({ title, text, url = 'https://www.luzhongkuan.cn' }) {
  const data = {
    actionCard: {
      title,
      text,
      hideAvatar: '0',
      btnOrientation: '0',
      singleTitle: '详情',
      singleURL: url,
    },
    msgtype: 'actionCard',
  }
  return send(data)
}

module.exports = {
  send,
  sendMarkdown,
  sendCard,
}
