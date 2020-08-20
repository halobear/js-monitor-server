const { formatTime } = require('../../utils/utils')
const mysql = require('../../utils/mysql')
const { assetsTypes } = require('../../constants/monitor')
const { list } = require('../../utils/mysql')
const table = 'halo_errors'

module.exports = async (ctx) => {
  let { page = 1, size = 1000 } = ctx.query
  page = page > 1 ? page : 1
  const getData = mysql
    .mysql(table)
    .count('brief as total')
    .select(['id', 'from', 'brief', 'type', 'stack', 'create_time'])
    .limit(size)
    .offset((page - 1) * size)
    .whereNotIn('type', assetsTypes)
    .orderBy('create_time', 'desc')
    .groupBy('brief')
  const getTotal = mysql
    .mysql(table)
    .countDistinct('brief as total')
    .whereNotIn('type', assetsTypes)
  const [list, total] = await Promise.all([getData, getTotal])

  ctx.state.data = {
    list: list.map((item) => ({
      ...item,
      create_time: formatTime(item.create_time),
    })),
    total: total.length ? total[0].total : 0,
  }
}
