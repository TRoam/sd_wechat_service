const express = require('express');
const request = require('request');
const router = express.Router();

// token
const accessTokenHelper = require('../lib/token/access-token');
const jsTicketHelper = require('../lib/token/jsapi-ticket');

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

router.post('/open-id', function(req, res, next) {
  console.log(req.body);
  const code = req.body.Code
  accessTokenHelper.getOpenIdByCode(code, openId => {
    res.send(openId);
  });
});

module.exports = router;