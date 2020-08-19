/*
 * @Description: 钉钉发送模板消息推送
 * @Date: 2019-06-12 13:21:39
 * @LastEditTime: 2020-06-25 16:34:38
 */
const Ding = require('@luzhongk/node-ding')

const ding = new Ding({
  access_token: 'addc88e7fdd25f7757b2afe31ca029c1c4f995511831fd195d72619db486e0b6',
  secret: 'SEC66666e1dd75f6ed3d24b481da985e82509df4acec8da2dea523a2895c4e90805',
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
