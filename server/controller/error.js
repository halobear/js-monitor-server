function test401(ctx) {
  const data = ctx.state.user ? ctx.state.user.data : ctx.session.user
  const user = { ...data, password: '***' }
  if (user) {
    return (ctx.state.data = user)
  }
  ctx.throw(401, '请登录')
}

function test403(ctx) {
  ctx.throw(403, '请登录')
}

function test404(ctx) {
  ctx.throw(404, '没有找到')
}

function test200(ctx) {
  ctx.state.data = '返回成功'
}

module.exports = {
  test401,
  test403,
  test404,
  test200,
}
