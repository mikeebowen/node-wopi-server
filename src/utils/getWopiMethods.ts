import { IncomingMessage, request } from 'http';
import { Element, xml2js } from 'xml-js';

export async function getWopiMethods(): Promise<any> {
  return new Promise((resolve, reject) => {
    const { OFFICE_ONLINE_SERVER: officeOnlineServer } = process.env;

    if (!officeOnlineServer) {
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
        const data: {[key: string]: [[string, string]]} = {};
        const implemented = process.env.WOPI_IMPLEMENTED?.split(',');

        dataFromXml.elements?.find((el: Element) => el.name === 'wopi-discovery')
          ?.elements?.find((el: Element) => el.name === 'net-zone')
          ?.elements?.forEach((el: Element) => {
            el.elements?.forEach((el: Element) => {
              if (el.attributes?.name && typeof(el.attributes?.name) === 'string') {
                if (implemented?.includes(el.attributes.name)) {
                  const name = el.attributes.name;
                  const splitUrl: string[] = (el.attributes.urlsrc)?.toString().split('?') ?? [];
                  const queryParams = splitUrl[1].replace(/<.*>/, '').replace(/&$/, '');

                  if (el.attributes?.ext) {
                    if (!Object.prototype.hasOwnProperty.call(data, el.attributes?.ext)) {
                      data[el.attributes.ext] = [[name, `${splitUrl[0]}?${queryParams}`]];
                    } else {
                      data[el.attributes.ext].push([name, `${splitUrl[0]}?${queryParams}`]);
                    }
                  }
                }
              }
            });
          });

        resolve(data);
      });
    };

    request(options, callback).end();
  });
}
