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
router.post('/monitor/login', controller.user.login)
router.get('/monitor/logout', controller.user.logout)

// 监控上报
router.get('/monitor/report', controller.monitor.report)
// 性能上报
router.get('/monitor/report/performance', controller.monitor.performance.report)
router.get('/monitor/performance/staticstics', controller.monitor.performance.statistics)
router.get('/monitor/performance/list', controller.monitor.performance.list)
// 项目列表
router.get('/monitor/projects', auth, controller.monitor.projects.list)
// 项目删除
router.delete('/monitor/projects', auth, controller.monitor.projects.delete)
// 实时监控
router.get('/monitor/allList', auth, controller.monitor.allList)
// js错误
router.get('/monitor/jserrors', auth, controller.monitor.jserrors)
// 资源错误
router.get('/monitor/loaderrors', auth, controller.monitor.loaderrors)
// 统计
router.get('/monitor/statistics', auth, controller.monitor.statistics)

module.exports = router
