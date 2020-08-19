const mysql = require('../../utils/mysql')
const dbName = 'halo_errors'

module.exports = async (ctx) => {
  ctx.state.data = await mysql.list(dbName, ctx.query)
}
