/**
 * 下边sql语句可以合并，但是～，不优化了(勿喷，已做缓存-。-)
 * 获取运行错误总数、获取资源错误总数、获取影响人数总数、获取影响页面总数、获取今日运行错误、获取今日资源错误、获取今日受影响人数、获取今日受影响页面
 */
const moment = require('moment')
const mysql = require('../../utils/mysql')
const { assetsTypes } = require('../../constants/monitor')
const cache = require('../../utils/cache')

const table = 'halo_errors'

const assetIds = assetsTypes.join(',')

// 获取运行错误总数
function fetchJSErrorTotal(pid) {
  const sql = `SELECT count(id) as total FROM ${table} WHERE type NOT IN (${assetIds}) AND pid = ${pid}`
  return mysql.mysql.raw(sql)
}
// 获取资源错误总数
function fetchAssetErrorTotal(pid) {
  const sql = `SELECT count(id) as total FROM ${table} WHERE type IN (${assetIds}) AND pid = ${pid}`
  return mysql.mysql.raw(sql)
}
// 获取影响人数总数
function fetchPersonEffetTotal(pid) {
  const sql = `SELECT COUNT(DISTINCT uid) as total FROM ${table} WHERE type NOT IN (${assetIds}) AND pid = ${pid}`
  return mysql.mysql.raw(sql)
}
// 获取影响页面总数
function fetchFromTotal(pid) {
  const sql = `SELECT COUNT(DISTINCT \`from\`) as total FROM ${table} WHERE pid = ${pid}`
  return mysql.mysql.raw(sql)
}
// 获取今日运行错误
function fetchJSErrorTodayTotal(pid) {
  const sql = `SELECT count(id) as total FROM ${table} WHERE type NOT IN (${assetIds}) AND TO_DAYS(create_time) = TO_DAYS(NOW()) AND pid = ${pid}`
  return mysql.mysql.raw(sql)
}
// 获取今日资源错误
function fetchAssetErrorTodayTotal(pid) {
  const sql = `SELECT count(id) as total FROM ${table} WHERE type IN (${assetIds}) AND TO_DAYS(create_time) = TO_DAYS(NOW()) AND pid = ${pid}`
  return mysql.mysql.raw(sql)
}
// 获取今日受影响人数
function fetchPersonEffetTodayTotal(pid) {
  const sql = `SELECT COUNT(DISTINCT uid) as total FROM ${table} WHERE TO_DAYS(create_time) = TO_DAYS(NOW()) AND pid = ${pid}`
  return mysql.mysql.raw(sql)
}
// 获取今日受影响页面
function fetchFromTodayTotal(pid) {
  const sql = `SELECT COUNT(DISTINCT \`from\`) as total FROM ${table} WHERE TO_DAYS(create_time) = TO_DAYS(NOW()) AND pid = ${pid}`
  return mysql.mysql.raw(sql)
}
// 获取最旧时间
function fetchStartTime(pid) {
  const sql = `SELECT create_time FROM ${table} WHERE pid = ${pid} ORDER BY create_time ASC LIMIT 1 OFFSET 0`
  return mysql.mysql.raw(sql)
}
// 获取各个类型总数
function fetchTypesTotalTotals(pid) {
  const sql = `SELECT COUNT(type) as total, type FROM ${table} WHERE TO_DAYS(create_time) = TO_DAYS(NOW()) AND pid = ${pid} GROUP BY type`
  return mysql.mysql.raw(sql)
}
// 获取10天运行错误echarts数据
async function fetchJsErrorDatas(pid) {
  const sql = `SELECT count(id) as total, create_time FROM halo_errors WHERE type NOT IN (${assetIds}) AND date_sub(curdate(), INTERVAL 9 DAY) <= date(create_time) AND pid = ${pid} GROUP BY YEAR(create_time),MONTH(create_time),DAY(create_time)`
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
async function fetchAssetErrorDatas(pid) {
  const sql = `SELECT count(id) as total, create_time FROM halo_errors WHERE type IN (${assetIds}) AND date_sub(curdate(), INTERVAL 9 DAY) <= date(create_time) AND pid = ${pid} GROUP BY YEAR(create_time),MONTH(create_time),DAY(create_time)`
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
  let { pid = '' } = ctx.query
  if (!pid) {
    ctx.throw(400, '请选择项目')
  }
  pid = `'${pid}'`
  const cacheKey = `monitor_statistics-${pid}`
  const oldStatistics = cache.get(cacheKey)
  if (oldStatistics) {
    return (ctx.state.data = oldStatistics)
  }
  const [[{ create_time: start_time } = {}] = []] = await fetchStartTime(pid)
  const [typesTotal = []] = await fetchTypesTotalTotals(pid)
  const jsErrorDatas = await fetchJsErrorDatas(pid)
  const assetErrorDatas = await fetchAssetErrorDatas(pid)
  const res = await Promise.all([
    fetchJSErrorTotal(pid),
    fetchAssetErrorTotal(pid),
    fetchPersonEffetTotal(pid),
    fetchFromTotal(pid),
    fetchJSErrorTodayTotal(pid),
    fetchAssetErrorTodayTotal(pid),
    fetchPersonEffetTodayTotal(pid),
    fetchFromTodayTotal(pid),
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
