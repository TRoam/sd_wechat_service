const express = require('express');
const request = require('request');

const router = express.Router();

const accessTokenHelper = require('../lib/token/access-token');

const sendkFMessage = (userId, kfMessage, res) => {
   accessTokenHelper.getAccessToken(token => {
      if (token) {
        request.post(`https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=${token}`, {
          json: {
            touser: userId,
            msgtype: 'text',
            text:
            {
                "content": kfMessage
            }
          }
        }, (error, response, body) => {
          const result = {
            userId,
            error,
            body
          };

          if (error) {
            res.send({
              ...result,
              message: 'Failed to push message'
            });
          }
          else {
            res.send({
              ...result,
              message: 'Message pushed successfully'
            });
          }
        });
      }
    });
};

router.post('/create', function (req, res, next) {
  const openId = req.body.OpenId;

  if (!openId) {
      res.send('openID is required!');
  }

  sendkFMessage(openId, "Sales Order <a href='http://google.com'>3002313</a> had been created!", res);
});

module.exports = router;
