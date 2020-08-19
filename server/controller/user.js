const jwtToken = require('../utils/jwtToken')

async function login(ctx) {
  const { username, password } = ctx.request.body
  if (username !== 'admin' || password !== 'admin') {
    ctx.throw(403, '改账号不存在')
  }
  const user = { username }
  const token = jwtToken(user)
  user.token = token
  ctx.state.data = user
}

function logout(ctx) {
  ctx.state.data = '注销登陆'
}

module.exports = {
  login,
  logout,
}
