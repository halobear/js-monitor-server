const router = require('koa-router')()
const controller = require('../controller')
const auth = require('../middlewares/auth')

// 测试
router.get('/test', controller.test)
router.get('/200', controller.error.test200)
router.get('/401', auth, controller.error.test401)
router.get('/403', controller.error.test403)
router.get('/404', controller.error.test404)

// 用户登陆
router.post('/login', controller.user.login)
router.get('/logout', controller.user.logout)

// 监控系统
router.get('/monitor/report', controller.monitor.report)
router.get('/monitor/projects', controller.monitor.projects)
router.get('/monitor/allList', controller.monitor.allList)
router.get('/monitor/jserrors', controller.monitor.jserrors)
router.get('/monitor/loaderrors', controller.monitor.loaderrors)

module.exports = router
