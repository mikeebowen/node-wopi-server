'use strict'
const http = require('http')
const convert = require('xml-js')

let hostingDiscovery

module.exports = async () => {
  // if (!hostingDiscovery) {
  hostingDiscovery = await getHostingDiscovery()
  // }

  return hostingDiscovery
}

const getHostingDiscovery = () => {
  return new Promise((resolve, reject) => {
    try {
      const options = {
        host: process.env.OFFICE_ONLINE_SERVER,
        path: '/hosting/discovery',
      }

      const callback = function (response) {
        let str = ''

        //another chunk of data has been received, so append it to `str`
        response.on('data', function (chunk) {
          str += chunk
        })

        //the whole response has been received, so respond
        response.on('end', function () {
          const data = convert.xml2js(str, { compact: true, spaces: 2 })

          resolve(data)
        })
      }
      http.request(options, callback).end()
    } catch (error) {
      reject(error)
    }
  })
}
