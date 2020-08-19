const jwt = require('jsonwebtoken')
const { secretKey } = require('../config')

module.exports = (data) => {
  return jwt.sign(
    { data },
    secretKey,
    { expiresIn: '1h' }
  )
}