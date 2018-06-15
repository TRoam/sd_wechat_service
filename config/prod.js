const commonConfig = require('./common');
const prodConfig = Object.assign({}, commonConfig, {
  secret: {
    appid: 'wx4bc586b9587fabba',
    secret: '7826cc0497709e36a5cb0917e59801bb'
  }
});

module.exports = prodConfig;