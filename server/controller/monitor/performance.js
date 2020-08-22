const mysql = require('../../utils/mysql')
const table = 'halo_performance'

// 性能统计上报
module.exports = async (ctx) => {
  const query = ctx.request.query
  if (!query.pid || !query.uid) {
    return (ctx.state.body = '')
  }
  ctx.state.data = await mysql.add(table, query)
  console.log(ctx.state.data)
}
