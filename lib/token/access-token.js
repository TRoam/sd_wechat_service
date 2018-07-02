const config = require('../../config').secret;
const request = require('request');

class AccessTokenHelper {
  getAccessToken(callback) {
    const now = parseInt(Date.now() / 1000);
    const { token, expire } = this.accessToken || {};

    if (expire > now) {
      callback(token);
    }
    else {
      this.requestAccessToken(accessToken => {
        const { access_token, expires_in } = accessToken || {};
        if (access_token) {
          this.accessToken = {
            token: access_token,
            expire: now + expires_in - 60
          }
        }

        callback(access_token)
      });
    }
  }

  requestAccessToken(callback) {
    const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${config.appid}&secret=${config.secret}`;

    console.log(config);
    // get accessToken
    request(url, function (error, res, body) {
      console.log(body)
      if (!error && res.statusCode == 200) {
        const token = JSON.parse(body);
        callback(token);
      }
      else {
        callback()
      }
    });
  }

  getOpenIdByCode(code, callback){
    const url = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${config.appid}&secret=${config.secret}&code=${code}&grant_type=authorization_code`;

    console.log(url);

    request(url, function(error, res, body){
      console.log(body);
      if (!error && res.statusCode == 200) {
        callback(JSON.parse(body));
      }
      else {
        callback()
      }

    });
  }
}

const accessTokenHelper = new AccessTokenHelper();

module.exports = {
  getAccessToken(callback) {
    return accessTokenHelper.getAccessToken(callback);
  },

  getOpenIdByCode(code, callback){
    return accessTokenHelper.getOpenIdByCode(code, callback); 
  }
};