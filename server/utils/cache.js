const LRU = require('lru-cache')
const options = {
  max: 500,
  maxAge: 1000 * 60 * 60 * 24 // 一天
}
const cache = new LRU(options)

module.exports = cache
