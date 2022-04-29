'use strict'
const http = require('http')
const convert = require('xml-js')
const { OFFICE_ONLINE_SERVER } = process.env

module.exports = async () => {
  return new Promise((resolve, reject) => {
    const hostUrl = new URL(OFFICE_ONLINE_SERVER)
    const options = {
      host: hostUrl.hostname,
      path: '/hosting/discovery',
    }

    const callback = function (response) {
      let str = ''

      //another chunk of data has been received, so append it to `str`
      response.on('data', function (chunk) {
        str += chunk
      })

      response.on('error', function (err) {
        reject(err)
      })

      //the whole response has been received, so respond
      response.on('end', function () {
        const json = convert.xml2js(str, { compact: true, spaces: 2 })
        const data = {}
        const implemented = process.env.WOPI_IMPLEMENTED.split(',')
        json['wopi-discovery']['net-zone'].app.forEach(a => {
          a.action.forEach(ac => {
            if (implemented.includes(ac._attributes.name)) {
              const name = ac._attributes.name
              const splitUrl = ac._attributes.urlsrc.split('?')
              const queryParams = splitUrl[1].replace(/<.*>/, '').replace(/&$/, '')

              if (!Object.prototype.hasOwnProperty.call(data, ac._attributes.ext)) {
                data[ac._attributes.ext] = [[name, `${splitUrl[0]}?${queryParams}`]]
              } else {
                data[ac._attributes.ext].push([name, `${splitUrl[0]}?${queryParams}`])
              }
            }
          })
        })

        resolve(data)
      })
    }

    http.request(options, callback).end()
  })
}
