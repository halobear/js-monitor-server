const mysql = require('../../utils/mysql')
const table = 'halo_errors'

module.exports = async (ctx) => {
  const projects = await mysql.mysql(table).distinct('pid')
  const errors = await mysql
    .mysql(table)
    .count('pid as total')
    .select(['pid'])
    .where(mysql.mysql.raw(`TO_DAYS(create_time) = TO_DAYS(NOW())`))
    .orderBy('create_time')
    .groupBy('pid')
  const errorsMap = errors.reduce((obj, item) => {
    obj[item.pid] = item.total || 0
    return obj
  }, {})
  projects.forEach((item) => {
    item.error = errorsMap[item.pid] || 0
  })
  ctx.state.data = projects
}
