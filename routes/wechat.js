const express = require('express');
const router = express.Router();
const wechat = require('wechat');
const message = require('../lib/message');

const config = require('../config');

const handleEvent = (msg) => {
  const { EventKey, FromUserName } = msg;
  const auth = message.getAuthorizationCheck(FromUserName);

  if (auth) {
    return auth;
  }

  switch (EventKey) {
    case 'profile':
      return message.getProfile(FromUserName);
      break;
    case 'display':
      // pull hots blogs
      return message.getDisplaySalesOrder(FromUserName);
      break;
    case 'support':
      // go to community to ask question
      return message.getHotTopics(FromUserName);
      break;
  }
};

const handleText = (msg) => {
  const { Content, FromUserName } = msg;
  const content = (Content || '').toUpperCase();
  const auth = message.getAuthorizationCheck(FromUserName);

  if (auth) {
    return auth;
  }

  if (content.indexOf('PROFILE') >= 0) {
    return message.getProfile(FromUserName);;
  }
  
  if (/^\d+$/.test(content)) {
    return message.getSalesOrder(content);
  }

  return '';
};

const handleSubscribe = (msg) => {
  return message.getSubscribeMessage(msg.FromUserName);
};

router.use('/', wechat(config.secret, function (req, res, next) {
  const msg = req.weixin;
  let response = '';

	console.log(req.weixin_xml);
  console.log(msg);

  if (msg.MsgType === 'event') {
    if (msg.Event === 'subscribe') {
      response = handleSubscribe(msg);
    }
    else if (msg.Event === 'CLICK') {
      response = handleEvent(msg);
    }
  }
  else if (msg.MsgType === 'text') {
    response = handleText(msg);
  }

	console.log(response);

  res.reply(response);
}));

module.exports = router;
