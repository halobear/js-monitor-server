const moment = require('moment')
const mysql = require('../utils/mysql')
const dbName = 'halo_errors'

const keys = ['type', 'desc', 'stack', 'from']

exports.report = async (ctx) => {
  const { query = {} } = ctx
  const create_time = moment().format('YYYY-MM-DD HH:mm:ss')
  const data = []
  const { pid, uid } = query
  for (let i = 0; i < 100; i++) {
    if (!query[`type[${i}]`]) break
    const item = keys.reduce(
      (obj, key) => {
        const value = query[`${key}[${i}]`]
        if (value) obj[key] = value
        return obj
      },
      { pid, uid, create_time }
    )
    data.push(item)
  }
  ctx.type = 'image/png'
  ctx.body = await mysql.mysql(dbName).insert(data)
}
