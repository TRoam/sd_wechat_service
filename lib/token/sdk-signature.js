const jsTicketHelper = require('./jsapi-ticket');
const crypto = require('crypto');
const config = require('../../config');

class SdkSignatureHelper {
  constructor(jsTicketHelper) {
    this.jsTicketHelper = jsTicketHelper;
  }

  createNoncestr() {
    return Math.random().toString(36).substr(2, 15);
  }

  createTimestamp() {
    return parseInt(new Date().getTime() / 1000) + '';
  }

  getSignature(url,callback) {
    const timestamp = this.createTimestamp();
    const noncestr = this.createNoncestr();
    this.jsTicketHelper.getJsTicket(ticket => {
       const signature = this.createSignature(ticket, noncestr, timestamp, url);
       console.log(ticket, signature);
       callback({
           appId: config.secret.appid,
           noncestr,
           timestamp,
           signature
       });
    });
  }

  createSignature(ticket, noncestr, timestamp, url) {
    const str = `jsapi_ticket=${ticket}&noncestr=${noncestr}&timestamp=${timestamp}&url=${url}`;   
    const generator = crypto.createHash('sha1');
    generator.update(str);
    return generator.digest('hex');
  }
}

const sdkSignatureHelper = new SdkSignatureHelper(jsTicketHelper);

module.exports = {
  getSignature(url, callback) {
    return sdkSignatureHelper.getSignature(url, callback);
  }
};