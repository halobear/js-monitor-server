const mysql = require('../../utils/mysql')
const table = 'halo_performance'

// 性能统计上报
async function report(ctx) {
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

// 所有列表
async function list(ctx) {
  ctx.state.data = await mysql.list(table, ctx.query)
}

// 统计性能
async function statistics(ctx) {
  const todayAvg = mysql
    .mysql(table)
    .avg('white_time as white_time')
    .avg('load_time as load_time')
    .avg('response_time as response_time')
    .avg('dns_query_time as dns_query_time')
    .avg('tcp_time as tcp_time')
    .where(mysql.mysql.raw('TO_DAYS(create_time) = TO_DAYS(NOW())'))
  const allAvg = mysql
    .mysql(table)
    .avg('white_time as white_time')
    .avg('load_time as load_time')
    .avg('response_time as response_time')
    .avg('dns_query_time as dns_query_time')
    .avg('tcp_time as tcp_time')
  const [[today = {}], [total = {}]] = await Promise.all([todayAvg, allAvg])
  ctx.state.data = { today, total }
}

module.exports = {
  report,
  list,
  statistics,
}
