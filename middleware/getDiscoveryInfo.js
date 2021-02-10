'use strict'
const http = require('http')
const convert = require('xml-js')

module.exports = async (req, res, next) => {
  const options = {
    host: process.env.WOPI_HOST,
    path: '/hosting/discovery',
  }

  const callback = function (response) {
    var str = ''

    //another chunk of data has been received, so append it to `str`
    response.on('data', function (chunk) {
      str += chunk
    })

    //the whole response has been received, so respond
    response.on('end', function () {
      const json = convert.xml2js(str, { compact: true, spaces: 2 })
      const data = {}
      json['wopi-discovery']['net-zone'].app.forEach(a => {
        a.action.forEach(ac => {
          if (process.env.WOPI_IMPLEMENTED.split(',').includes(ac._attributes.name)) {
            if (!Object.prototype.hasOwnProperty.call(data, ac._attributes.ext)) {
              data[ac._attributes.ext] = {
                [ac._attributes.name]: ac._attributes.urlsrc.split('?')[0],
              }
            } else {
              data[ac._attributes.ext][ac._attributes.name] = ac._attributes.urlsrc.split('?')[0]
            }
          }
        })
      })

      res.send(data)
    })
  }

  http.request(options, callback).end()
}
