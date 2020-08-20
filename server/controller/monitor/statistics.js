/**
 * 获取运行错误总数、获取资源错误总数、获取影响人数总数、获取影响页面总数、获取今日运行错误、获取今日资源错误、获取今日受影响人数、获取今日受影响页面
 */
const moment = require('moment')
const mysql = require('../../utils/mysql')
const { assetsTypes } = require('../../constants/monitor')
const cache = require('../../utils/cache')

const cacheKey = 'monitor_statistics'
const table = 'halo_errors'

const assetIds = assetsTypes.join(',')

// 获取运行错误总数
function fetchJSErrorTotal() {
  const sql = `SELECT count(id) as total FROM ${table} WHERE type NOT IN (${assetIds})`
  return mysql.mysql.raw(sql)
}
// 获取资源错误总数
function fetchAssetErrorTotal() {
  const sql = `SELECT count(id) as total FROM ${table} WHERE type IN (${assetIds})`
  return mysql.mysql.raw(sql)
}
// 获取影响人数总数
function fetchPersonEffetTotal() {
  const sql = `SELECT COUNT(DISTINCT uid) as total FROM ${table} WHERE type NOT IN (${assetIds})`
  return mysql.mysql.raw(sql)
}
// 获取影响页面总数
function fetchFromTotal() {
  const sql = `SELECT COUNT(DISTINCT \`from\`) as total FROM ${table}`
  return mysql.mysql.raw(sql)
}
// 获取今日运行错误
function fetchJSErrorTodayTotal() {
  const sql = `SELECT count(id) as total FROM ${table} WHERE type NOT IN (${assetIds}) AND TO_DAYS(create_time) = TO_DAYS(NOW())`
  return mysql.mysql.raw(sql)
}
// 获取今日资源错误
function fetchAssetErrorTodayTotal() {
  const sql = `SELECT count(id) as total FROM ${table} WHERE type IN (${assetIds}) AND TO_DAYS(create_time) = TO_DAYS(NOW())`
  return mysql.mysql.raw(sql)
}
// 获取今日受影响人数
function fetchPersonEffetTodayTotal() {
  const sql = `SELECT COUNT(DISTINCT uid) as total FROM ${table} WHERE TO_DAYS(create_time) = TO_DAYS(NOW());`
  return mysql.mysql.raw(sql)
}
// 获取今日受影响页面
function fetchFromTodayTotal() {
  const sql = `SELECT COUNT(DISTINCT \`from\`) as total FROM ${table} WHERE TO_DAYS(create_time) = TO_DAYS(NOW())`
  return mysql.mysql.raw(sql)
}
// 获取最旧时间
function fetchStartTime() {
  const sql = `SELECT create_time FROM ${table} ORDER BY create_time ASC LIMIT 1 OFFSET 0`
  return mysql.mysql.raw(sql)
}
// 获取各个类型总数
function fetchTypesTotalTotals() {
  const sql = `SELECT COUNT(type) as total, type FROM ${table} WHERE TO_DAYS(create_time) = TO_DAYS(NOW()) GROUP BY type`
  return mysql.mysql.raw(sql)
}
// 获取10天运行错误echarts数据
async function fetchJsErrorDatas() {
  const sql = `SELECT count(id) as total, create_time FROM halo_errors WHERE type NOT IN (${assetIds}) AND date_sub(curdate(), INTERVAL 9 DAY) <= date(create_time) GROUP BY YEAR(create_time),MONTH(create_time),DAY(create_time)`
  const [list = []] = await mysql.mysql.raw(sql)
  const dateTotalMap = list.reduce((obj, item) => {
    obj[moment(item.create_time).format('MM/DD')] = item.total
    return obj
  }, {})
  const data = [...Array(10).keys()].map((i) => {
    const date = moment().subtract(i, 'days').format('MM/DD')
    return {
      date,
      total: dateTotalMap[date] || 0,
    }
  })
  return data
}
// 获取10天资源错误echarts数据
async function fetchAssetErrorDatas() {
  const sql = `SELECT count(id) as total, create_time FROM halo_errors WHERE type IN (${assetIds}) AND date_sub(curdate(), INTERVAL 9 DAY) <= date(create_time) GROUP BY YEAR(create_time),MONTH(create_time),DAY(create_time)`
  const [list = []] = await mysql.mysql.raw(sql)
  const dateTotalMap = list.reduce((obj, item) => {
    obj[moment(item.create_time).format('MM/DD')] = item.total
    return obj
  }, {})
  const data = [...Array(10).keys()].map((i) => {
    const date = moment().subtract(i, 'days').format('MM/DD')
    return {
      date,
      total: dateTotalMap[date] || 0,
    }
  })
  return data
}

// 统计结果缓存一分钟
module.exports = async (ctx) => {
  const oldStatistics = cache.get(cacheKey)
  if (oldStatistics) {
    return (ctx.state.data = oldStatistics)
  }
  const [[{ create_time: start_time } = {}] = []] = await fetchStartTime()
  const [typesTotal = []] = ([] = await fetchTypesTotalTotals())
  const jsErrorDatas = await fetchJsErrorDatas()
  const assetErrorDatas = await fetchAssetErrorDatas()
  const res = await Promise.all([
    fetchJSErrorTotal(),
    fetchAssetErrorTotal(),
    fetchPersonEffetTotal(),
    fetchFromTotal(),
    fetchJSErrorTodayTotal(),
    fetchAssetErrorTodayTotal(),
    fetchPersonEffetTodayTotal(),
    fetchFromTodayTotal(),
  ])
  const keys = [
    'jsErrorTotal',
    'assetErrorTotal',
    'personEffetTotal',
    'fromTotal',
    'jsErrorTodayTotal',
    'assetErrorTodayTotal',
    'personEffetTodayTotal',
    'fromTodayTotal',
  ]
  const data = {
    start_time: moment(start_time).format('YYYY/MM/DD HH:mm:ss'),
    end_time: moment().format('YYYY/MM/DD HH:mm:ss'),
    typesTotal,
    jsErrorDatas,
    assetErrorDatas,
  }
  res.forEach(([[{ total } = {}] = []] = [], i) => {
    const key = keys[i]
    data[key] = total
  })
  cache.set(cacheKey, data, 1000 * 60)
  ctx.state.data = data
}
