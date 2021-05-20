'use strict'
const { getWopiMethods } = require('../utils')

module.exports = async (req, res, next) => {
  const data = await getWopiMethods()
  res.send(data)
}
