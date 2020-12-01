'use strict'
const http = require('http')
const convert = require('xml-js')

module.exports = async (req, res, next) => {
  const options = {
    host: '172.22.151.150',
    path: '/hosting/discovery',
  }

  const callback = function (response) {
    var str = ''

    //another chunk of data has been received, so append it to `str`
    response.on('data', function (chunk) {
      str += chunk
    })

    //the whole response has been received, so we just print it out here
    response.on('end', function () {
      const xml = convert.xml2js(str, { compact: true, spaces: 2 })
      console.log(xml)
    })
  }

  http.request(options, callback).end()
  next()
}
