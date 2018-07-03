const express = require('express');
const router = express.Router();

// token
const accessTokenHelper = require('../lib/token/access-token');
const jsTicketHelper = require('../lib/token/jsapi-ticket');
const sdkSignatrue = require('../lib/token/sdk-signature');

router.get("/access-token", function (req, res, next) {
  accessTokenHelper.getAccessToken(token => {
    res.send({
      token
    });
  });
});

router.get("/jsapi-ticket", function (req, res, next) {
  jsTicketHelper.getJsTicket(ticket => {
    res.send({
      ticket
    });
  });
});

router.post("/wx-config", function(req, res, next) {
  const url = req.body.Url;
  sdkSignatrue.getSignature(url, config => {
     res.send(config);
  });
});

router.post('/open-id', function(req, res, next) {
  console.log(req.body);
  const code = req.body.Code
  accessTokenHelper.getOpenIdByCode(code, openId => {
    res.send(openId);
  });
});

module.exports = router;