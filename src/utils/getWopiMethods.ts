// 'use strict';
// const http = require('http');
// const convert = require('xml-js');
import { IncomingMessage, request } from 'http';
import { Element, xml2js } from 'xml-js';

export const getWopiMethods = async (): Promise<any> => {
  return new Promise((resolve, reject) => {
    try {
      const { OFFICE_ONLINE_SERVER: officeOnlineServer } = process.env || '';

      if (officeOnlineServer == null) {
        throw new Error('process.env.OFFICE_ONLINE_SERVER must be defined and point to an instance of Office Online Server');
      }

      const hostUrl = new URL(officeOnlineServer);
      const options = {
        host: hostUrl.hostname,
        path: '/hosting/discovery',
      };

      const callback = function(response: IncomingMessage) {
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
          const dataFromXml = xml2js(str, { compact: false }) as Element;
          const data: {[key: string]: string[]} = {};
          const implemented = process.env.WOPI_IMPLEMENTED?.split(',');
          const actions: Element[] = [];

          dataFromXml.elements?.forEach((el: Element) => {
            if (el.name === 'net-zone') {
              el.elements?.forEach((ele: Element) => {
                ele.elements?.forEach((elem: Element) => {
                  if (elem.name === 'action') {
                    actions.push(elem);
                  }
                });
              });
            }
          });



          // dataFromXml['wopi-discovery']['net-zone'].app.forEach((a) => {
          //   a.action.forEach((ac) => {
          //     if (implemented?.includes(ac._attributes.name)) {
          //       const name = ac._attributes.name;
          //       const splitUrl = ac._attributes.urlsrc.split('?');
          //       const queryParams = splitUrl[1].replace(/<.*>/, '').replace(/&$/, '');

          //       if (!Object.prototype.hasOwnProperty.call(data, ac._attributes.ext)) {
          //         data[ac._attributes.ext] = [[name, `${splitUrl[0]}?${queryParams}`]];
          //       } else {
          //         data[ac._attributes.ext].push([name, `${splitUrl[0]}?${queryParams}`]);
          //       }
          //     }
          //   });
          // });

          resolve(data);
        });
      };

      request(options, callback).end();
    } catch (err) {
      Promise.reject(err);
    }
  });
};
