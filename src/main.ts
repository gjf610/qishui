import * as https from 'https';
import * as md5 from 'md5';
import * as querystring from 'querystring'
import { appId, appSecret } from './private'

const errorMap = {
  52003: '用户认证失败',
  52004: 'error2',
  52005: '',
  unknown: '服务器繁忙',
}


export const translate = (words) => {

  const salt = Math.random()
  const sign = md5(appId + words + salt + appSecret)
  const query: string = querystring.stringify({
    q: words,
    from: 'en',
    to: 'zh',
    appid: appId,
    salt,
    sign
  })

  const options = {
    hostname: 'api.fanyi.baidu.com',
    port: 443,
    path: '/api/trans/vip/translate?' + query,
    method: 'GET'
  };
  const request = https.request(options, (response) => {
    let chunks = []
    response.on('data', (chunk) => {
      chunks.push(chunk)
    });
    response.on('end', () => {
      const string = Buffer.concat(chunks).toString()
      type BaiduResult = {
        error_code?: string,
        error_msg?: string
        from: string,
        to: string,
        trans_result: {
          src: string,
          dst: string,
        }[]
      }
      const obj: BaiduResult = JSON.parse(string)
      if (obj.error_code) {
        console.error(errorMap[obj.error_code] || obj.error_msg)
        process.exit(2);
      } else {
        console.log(obj.trans_result[0].dst)
        process.exit(0);

      }
    })
  });

  request.on('error', (e) => {
    console.error(e);
  });
  request.end();
}