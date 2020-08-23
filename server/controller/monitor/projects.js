const mysql = require('../../utils/mysql')
const table = 'halo_errors'
const perTable = 'halo_performance'

const cache = require('../../utils/cache')
const cacheKey = 'monitor_projects'

function fetchProjects() {
  const sql = `
  SELECT
    p.pid AS pid,
    p.id,
    p.pid,
    MIN( p.create_time ) AS start_time,
    MAX( p.create_time ) AS end_time,
    AVG( p.white_time ) AS white_time,
    AVG( p.load_time ) AS load_time,
    AVG( p.dom_use_time ) AS dom_use_time,
    AVG( p.redirect_time ) AS redirect_time,
    AVG( p.response_time ) AS response_time,
    AVG( p.dns_query_time ) AS dns_query_time,
    AVG( p.dns_cache_time ) AS dns_cache_time,
    AVG( p.tcp_time ) AS tcp_time,
    COUNT( DISTINCT uid ) AS visitor_total,
    IFNULL( r.total, 0 ) AS today_visitor_total,
    IFNULL( s.total, 0 ) AS error,
    IFNULL( t.total, 0 ) AS todayError
  FROM
    ${perTable} p
    LEFT JOIN ( SELECT pid, COUNT( DISTINCT uid ) AS total FROM ${perTable} WHERE TO_DAYS( NOW( ) ) = TO_DAYS( create_time ) GROUP BY pid ) r ON p.pid = r.pid 	
    LEFT JOIN ( SELECT pid, brief, COUNT( * ) AS total FROM ${table} GROUP BY pid ) s ON s.pid = p.pid
    LEFT JOIN ( SELECT pid, COUNT( * ) AS total FROM ${table} WHERE TO_DAYS( NOW( ) ) = TO_DAYS( create_time ) GROUP BY pid ) t ON t.pid = p.pid 
  GROUP BY
    pid
  `
  return mysql.mysql.raw(sql)
}

module.exports = {
  async list(ctx) {
    const oldCache = cache.get(cacheKey)
    if (oldCache) {
      return (ctx.state.data = oldCache)
    }
    const [projects = []] = await fetchProjects()
    // 缓存1分钟
    cache.set(cacheKey, projects, 1000 * 60)
    ctx.state.data = projects
  },
  async delete(ctx) {
    const { pid } = await ctx.query
    if (!pid) {
      ctx.throw(400, '请选择项目')
    }
    ctx.state.data = await Promise.all([
      mysql.mysql(table).where({ pid }).del(),
      mysql.mysql(perTable).where({ pid }).del(),
    ])
    cache.del(cacheKey)
  },
}
