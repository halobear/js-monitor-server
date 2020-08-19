const mysql = require('../utils/mysql')
const jwtToken = require('../utils/jwtToken')

async function login(ctx) {
  const { username, password } = ctx.request.body
  if (!username || !password) {
    ctx.throw(403, '请完善账号密码')
  }

  const { list = [] } = await mysql.list('halo_manage', { password, username })
  const [user] = list
  if (!user) {
    ctx.throw(403, '账号不存在')
  }
  const u = { username, nickname: user.nickname, id: user.id, avatar: user.avatar }
  const token = jwtToken(u)
  u.token = token
  ctx.state.data = u
}

function logout(ctx) {
  ctx.state.data = '注销登陆'
}

module.exports = {
  login,
  logout,
}
