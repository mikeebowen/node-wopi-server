'use strict';

import * as http from 'http';
import { IncomingMessage } from 'http';
const convert = require('xml-js');
const { OFFICE_ONLINE_SERVER: officeOnlineServer } = process.env;

export async function getProofKeys() {
  return new Promise((resolve, reject) => {
    if (officeOnlineServer == null) {
      throw new Error('process.env.OFFICE_ONLINE_SERVER must be defined and point to an instance of Office Online Server');
    }

    const hostUrl = new URL(officeOnlineServer);
    const options = {
      host: hostUrl.hostname,
      path: '/hosting/discovery',
    };

    function callback(response: IncomingMessage): void {
      let str = '';

      // another chunk of data has been received, so append it to `str`
      response.on('data', function(chunk) {
        str += chunk;
      });

      response.on('error', function(err) {
        reject(err);
      });

      // the whole response has been received, so respond
      response.on('end', function() {
        const json = convert.xml2js(str, { compact: true });

        const { oldmodulus, oldexponent, modulus, exponent } = json['wopi-discovery']['proof-key']._attributes;

        resolve({ oldmodulus, oldexponent, modulus, exponent });
      });
    }

    http.request(options, callback).end();
  });
}

;
