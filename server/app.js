const path = require('path')
const Koa = require('koa')
const koaStatic = require('koa-static')
const jwt = require('koa-jwt')

const routers = require('./routers')
const logger = require('./middlewares/logger')
const config = require('./config')

const app = new Koa()

// cookie 密钥
app.keys = ['node-api']

// ip
app.proxy = true

// 静态资源
const staticPath = path.join(__dirname, '../static') // static
app.use(koaStatic(staticPath))

// 日志
app.use(logger)

// jwt
app.use(jwt({ secret: config.secretKey, passthrough: true }))

app.use(routers.routes()).use(routers.allowedMethods())

module.exports = app
