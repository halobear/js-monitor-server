const mysql = require('../../utils/mysql')
const table = 'halo_errors'

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

module.exports = async (ctx) => {
  const key = 'monitor_projects'
  const oldCache = cache.get(key)
  if (oldCache) {
    return (ctx.state.data = oldCache)
  }
  const [projects, errorsMap] = await Promise.all([fetchProjects(), fetchTodayErrorsMap()])
  projects.forEach((item) => {
    item.todayError = errorsMap[item.pid] || 0
  })
  // 缓存1分钟
  cache.set(key, projects, 1000 * 60)
  ctx.state.data = projects
}
