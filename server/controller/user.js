const jwtToken = require('../utils/jwtToken')

async function login(ctx) {
  const { username, password } = ctx.request.body
  const { list = [] } = await mysql.list('kuan_manager', { password, username })
  const [user] = list
  if (!user) {
    ctx.throw(403, '改账号不存在')
  }
  const u = { username, id: user.id }
  const token = jwtToken(u)
  user.token = token
  ctx.state.data = u
}

function logout(ctx) {
  ctx.state.data = '注销登陆'
}

module.exports = {
  login,
  logout,
}
