const logger = require('@luzhongk/node-logger')
const app = require('./app')
const config = require('./constants/config')

require('./utils/schedule')

// 监听端口
app.listen(config.port)
logger.run(config.port)
