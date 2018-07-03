const express = require('express');
const request = require('request');

const router = express.Router();

const accessTokenHelper = require('../lib/token/access-token');
const config = require('../config');
const message = require('../lib/message');

const userStore = require('../lib/store').user;
const pushStore = require('../lib/store').push;

const getTemplateId = (templateName) => {
  return config.templates[templateName];
};

const escapeValue = (str) => {
  let escapedStr = str.replace(/<br>/ig, ' ').replace(/<\w+(.)*?>/g, '').replace(/<\/\w+(.)>/g, '');

  if (escapedStr.length > 100) {
    escapedStr = escapedStr.substr(0, 100) + '...';
  }

  return escapedStr;
};

const getTemplateData = (data) => {
  const templateData = {};

  for (var key in data) {
    const value = data[key];

    if (value) {
      templateData[key] = {
        value: escapeValue(value),
        color: "#0000FF"
      }
    }
  }

  templateData['view'] = {
    value: 'Click to see detail, have a good time',
    color: "#008000"
  }

  return templateData;
};

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

router.post('/bind', function (req, res, next) {
  const email = req.body.Email;
  const openId = req.body.OpenId;
  // const code = req.body.Code;

  console.log(req.body);
 
  if (!openId || !email) {
    res.send('openid or email is required!');
  }
  const user = {};
  user[openId] = email;
  userStore.append(user);

  userStore.flush((error) => {
    sendkFMessage(openId, `Congcongratulations, Your account had been bound to ${email} successfully!` ,res);
  });
});

router.post('/check', function (req, res, next) {
  const openId = req.body.OpenId;

  const email = userStore.has(openId);

  if (!!email) {
    res.send({
      email
    });
  } else {
    res.send({
      error: 'No Authorization' 
    });
  }
});

router.post('/push', function (req, res, next) {
  const { user, url, template, data, uuid } = req.body;

  if (!user) {
    res.send('User is required');
    return;
  }

  const template_id = getTemplateId(template);

  if (!template_id) {
    res.send(`Template ${template} is invalid`);
    return;
  }

  if (pushStore.has(uuid)) {
    res.send(`${uuid} has already been pushed`);
    return;
  }

  pushStore.append(uuid);

  pushStore.flush(error => {
    const templateData = {
      touser: user,
      template_id,
      url,
      topcolor: '#FF0000',
      data: getTemplateData(data)
    };

    console.log(`Push message: ${JSON.stringify(templateData)}`);

    accessTokenHelper.getAccessToken(token => {
      request.post(`https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${token}`, {
        json: templateData
      }, (error, response) => {
        console.log(response.body);

        if (error) {
          res.send('Failed to send template, please check log');
        }
        else {
          res.send('Send template successfully');
        }
      });
    });
  });
});

router.post('/push-kf-message', function (req, res, next) {
  const { type, userId } = req.body;

  if (userId) {
    let kfMessage = null;

    if (type === 'blog') {
      kfMessage = message.getHotBlogs(userId);
    }
    else if (type === 'topic') {
      kfMessage = message.getHotTopics(userId);
    }
    else {
      res.send(`Invalid message type:${type}`);
      return;
    }

    accessTokenHelper.getAccessToken(token => {
      if (token) {
        request.post(`https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=${token}`, {
          json: {
            touser: userId,
            msgtype: 'news',
            news: {
              articles: kfMessage
            }
          }
        }, (error, response, body) => {
          const result = {
            type,
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
      else {
        res.send('Cannot get access token');
      }
    });
  }
  else {
    res.send('UserId is required');
  }
});

module.exports = router;
