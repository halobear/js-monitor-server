const mysql = require('../../utils/mysql')
const table = 'halo_errors'

module.exports = async (ctx) => {
  ctx.state.data = await mysql.mysql(table).distinct('pid')
}
