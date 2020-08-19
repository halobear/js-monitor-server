// 权限控制
module.exports = (ctx, next) => {
  if (ctx.state.user && ctx.state.user.exp > Date.now() / 1000) {
    return next()
  }
  ctx.throw(401, '请先登陆')
}
