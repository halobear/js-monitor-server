const mysql = require('../../utils/mysql')
const table = 'halo_performance'

// 性能统计上报
module.exports = async (ctx) => {
  const {
    pid,
    uid,
    white_time,
    load_time,
    dom_use_time,
    redirect_time,
    response_time,
    dns_query_time,
    dns_cache_time,
    tcp_time,
  } = ctx.query
  if (!pid || !uid) {
    return (ctx.state.body = '')
  }
  const data = {
    pid,
    uid,
    white_time,
    load_time,
    dom_use_time,
    redirect_time,
    response_time,
    dns_query_time,
    dns_cache_time,
    tcp_time,
  }
  ctx.state.data = await mysql.add(table, data)
}
