const jsTicketHelper = require('./jsapi-ticket');
const crypto = require('crypto');
const config = require('../../config');
const jsSHA = require('jssha');

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

  raw(args) {
    let keys = Object.keys(args);
    keys = keys.sort()
    let newArgs = {};

    keys.forEach(function (key) {
      newArgs[key.toLowerCase()] = args[key];
    });

    var string = '';
    for (var k in newArgs) {
      string += '&' + k + '=' + newArgs[k];
    }
    string = string.substr(1);

    return string;
  }

  getSignature(url,callback) {
    const timestamp = this.createTimestamp();
    const noncestr = this.createNoncestr();
    this.jsTicketHelper.getJsTicket(ticket => {
       const signature = this.createSignature(ticket, noncestr, timestamp, url);
       console.log(ticket, signature);
       callback({
           url,
           ticket,
           appId: config.secret.appid,
           noncestr,
           timestamp,
           signature
       });
    });
  }

  createSignature(ticket, noncestr, timestamp, url) {
    const ret = {
      jsapi_ticket: ticket,
      nonceStr: noncestr,
      timestamp: timestamp,
      url: url
    };

    const string = this.raw(ret);
    console.log(string);
    const shaObj = new jsSHA(string, 'TEXT');
    const signature = shaObj.getHash('SHA-1', 'HEX');

    return signature;
  }
}

const sdkSignatureHelper = new SdkSignatureHelper(jsTicketHelper);

module.exports = {
  getSignature(url, callback) {
    return sdkSignatureHelper.getSignature(url, callback);
  }
};