const mysql = require('../../utils/mysql')
const table = 'halo_errors'
const perTable = 'halo_performance'

const cache = require('../../utils/cache')

function fetchProjects() {
  return mysql
    .mysql(table)
    .count('pid as error')
    .select(['pid', 'create_time'])
    .orderBy('create_time')
    .groupBy('pid')
}

async function fetchTodayErrorsMap() {
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
  return errorsMap
}

async function getPerformanceByPid() {
  const performanceList = await mysql
    .mysql(perTable)
    .avg('white_time as white_time')
    .avg('load_time as load_time')
    .avg('dom_use_time as dom_use_time')
    .avg('redirect_time as redirect_time')
    .avg('response_time as response_time')
    .avg('dns_query_time as dns_query_time')
    .avg('dns_cache_time as dns_cache_time')
    .avg('tcp_time as tcp_time')
    .select('pid')
    .limit(300)
    .offset(0)
    .groupBy('pid')

  const performanceMap = performanceList.reduce((obj, item) => {
    obj[item.pid] = item
    return obj
  }, {})
  return performanceMap
}

module.exports = async (ctx) => {
  const key = 'monitor_projects'
  const oldCache = cache.get(key)
  if (oldCache) {
    return (ctx.state.data = oldCache)
  }
  const [projects, errorsMap, performanceMap] = await Promise.all([
    fetchProjects(),
    fetchTodayErrorsMap(),
    getPerformanceByPid(),
  ])
  projects.forEach((item) => {
    item.todayError = errorsMap[item.pid] || 0
    Object.assign(item, performanceMap[item.pid])
  })
  // 缓存1分钟
  cache.set(key, projects, 1000 * 60)
  ctx.state.data = projects
}
