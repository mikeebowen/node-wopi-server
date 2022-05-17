'use strict';

const http = require('http');
const convert = require('xml-js');
const { OFFICE_ONLINE_SERVER } = process.env;

module.exports = async () => {
  return new Promise((resolve, reject) => {
    const hostUrl = new URL(OFFICE_ONLINE_SERVER);
    const options = {
      host: hostUrl.hostname,
      path: '/hosting/discovery',
    };

    const callback = function (response) {
      let str = '';

      //another chunk of data has been received, so append it to `str`
      response.on('data', function (chunk) {
        str += chunk;
      });

      response.on('error', function (err) {
        reject(err);
      });

      //the whole response has been received, so respond
      response.on('end', function () {
        const json = convert.xml2js(str, { compact: true, spaces: 2 });

        const { oldmodulus, oldexponent, modulus, exponent } = json['wopi-discovery']['proof-key']._attributes;

        resolve({ oldmodulus, oldexponent, modulus, exponent });
      });
    };

    http.request(options, callback).end();
  });
};
