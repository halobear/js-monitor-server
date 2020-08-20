const mysql = require('../../utils/mysql')
const { assetsTypes } = require('../../constants/monitor')
const table = 'halo_errors'

module.exports = async (ctx) => {
  const { page = 1, size = 2 } = ctx.query
  const getList = mysql
    .mysql(table)
    .count('brief as total')
    .select(['id', 'from', 'brief', 'type', 'create_time'])
    .whereIn('type', assetsTypes)
    .orderBy('create_time', 'desc')
    .limit(size)
    .offset((page - 1) * size)
    .groupBy('brief')
  const getTotal = mysql.mysql(table).countDistinct('brief as total').whereIn('type', assetsTypes)

  const [list = [], [{ total = 0 } = {}] = []] = await Promise.all([getList, getTotal])
  ctx.state.data = { list, total }
}
