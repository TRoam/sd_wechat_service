const request = require('request');
const accessTokenHelper = require('./access-token');

class JsApiTicketHelper {
  constructor(accessTokenHelper) {
    this.accessTokenHelper = accessTokenHelper;
  }

  getJsTicket(callback) {
    const now = parseInt(Date.now() / 1000);
    const { ticket, expire } = this.jsTicket || {};

    if (expire > now) {
      callback(ticket);
    }
    else {
      this.requestJsTicket(jsTicket => {
        const { ticket, expires_in } = jsTicket || {};
        if (ticket) {
          this.jsTicket = {
            ticket,
            expire: now + expires_in - 60
          }
        }

        callback(ticket)
      });
    }
  }

  requestJsTicket(callback) {
    this.accessTokenHelper.getAccessToken(token => {
      const url = `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${token}&type=jsapi`;

      // get js ticket 
      request(url, function (error, res, body) {
        if (!error && res.statusCode == 200) {
          const token = JSON.parse(body);
          callback(token);
        }
        else {
          callback()
        }
      });
    });
  }
}

const jsTicketHelper = new JsApiTicketHelper(accessTokenHelper);

module.exports = {
  getJsTicket(callback) {
    return jsTicketHelper.getJsTicket(callback);
  }
};