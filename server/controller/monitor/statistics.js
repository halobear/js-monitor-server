/**
 * 获取运行错误总数、获取资源错误总数、获取影响人数总数、获取影响页面总数、获取今日运行错误、获取今日资源错误、获取今日受影响人数、获取今日受影响页面
 */

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

// 统计结果缓存一分钟
module.exports = async (ctx) => {
  const oldStatistics = cache.get(cacheKey)
  if (oldStatistics) return oldStatistics
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
  const data = {}
  res.forEach(([[{ total } = {}] = []] = [], i) => {
    const key = keys[i]
    data[key] = total
  })
  cache.set(cacheKey, data, 1000 * 60)
  ctx.state.data = data
}
