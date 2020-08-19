const mysql = require('../../utils/mysql')
const table = 'halo_errors'

module.exports = async (ctx) => {
  const { page = 1, size = 2 } = ctx.query
  const getList = mysql
    .mysql(table)
    .count('brief as count')
    .select(['id', 'pid', 'uid', 'from', 'brief', 'create_time', 'type'])
    .whereIn('type', [2, 3, 4, 5, 6])
    .orderBy('create_time', 'desc')
    .limit(size)
    .offset((page - 1) * size)
    .groupBy('brief')
    .count('id as total')

  console.log(getList.toSQL())
  ctx.state.data = await getList
}
