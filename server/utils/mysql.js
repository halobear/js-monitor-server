/**
 * knex 数据操作封装
 */
const MysqlHelper = require('@luzhongk/node-mysql')

const config = require('../config')

module.exports = new MysqlHelper(config.mysql)
