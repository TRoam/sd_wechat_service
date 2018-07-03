const express = require('express');
const request = require('request');

const router = express.Router();

const orderStore = require('../lib/store').order;
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

const createOrderId = () => {
   return '3' + Math.random().toString().substr(2,6);
};

router.post('/create', function (req, res, next) {
  const openId = req.body.OpenId;
  const orderData = req.body.Data;
  const id = createOrderId();

  if (!openId) {
    res.send('openID is required!');
  }

  if (orderData) {
    const order = {}
    order[id] = orderData;
  }
  orderStore.append(user);

  orderStore.flush((error) => {
    sendkFMessage(openId, `Sales order <stong>${id}</stong> had been created successfully!` ,res);
  });

});

module.exports = router;
