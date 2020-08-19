const router = require('koa-router')()
const bodyParser = require('koa-bodyparser')
const response = require('../middlewares/response.js')

router.use(response)

// page
router.use('/api', bodyParser(), require('./api').routes())

module.exports = router
