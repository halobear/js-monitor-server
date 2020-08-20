const moment = require('moment')

exports.formatTime = (t) => moment(t).format('YYYY-MM-DD HH:mm:ss')
