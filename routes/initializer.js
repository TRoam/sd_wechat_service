const express = require('express');
const request = require('request');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const mediaRouter = express.Router();
const store = require('../lib/store').store;
const config = require('../config');

// token
const accessTokenHelper = require('../lib/token/access-token');
const mediaDir = path.join(__dirname, '../data/media/images')

const mediaImageStore = new store(path.join(__dirname, '../data/media-image.txt'));
const mediaNewsStore = new store(path.join(__dirname, '../data/media-news.txt'));;

function getCustomizedMenu() {
  return {
    "button": [
        {
            "type": "view", 
            "name": "Create Sales Order", 
            "url": `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${config.secret.appid}&redirect_uri=${encodeURIComponent(config.uiServer)}&response_type=code&scope=snsapi_base&state=create#wechat_redirect`
        },
        {
            "name": "More", 
            "sub_button": [
                {
                    "type": "click",
                    "name": "My Profile", 
                    "key": `profile`
                },
                {
                    "type": "click", 
                    "name": "Display Order", 
                    "key": "display"
                },
                {
                  "type": "view",
                  "name": "SAP",
                  "url": "http://www.sap.com"
                }
            ]
        }
     ]
  };
}

function uploadImage(filepath, callback) {
  accessTokenHelper.getAccessToken(token => {
    const url = `https://api.weixin.qq.com/cgi-bin/material/add_material?access_token=${token}&type=image`;
    const media = fs.createReadStream(filepath);

    request.post({
      url: url,
      json: true,
      formData: {
        media: media,
        nonce: ''
      }
    }, (error, response, body) => {
      callback(error, body);
    });
  });
}

mediaRouter.post('/image', function (req, res, next) {
  fs.readdir(path.join(mediaDir, 'images'), (error, files) => {
    if (error) {
      res.send(`Cannot access media directory\nError: ${error.message}`);
    }
    else {
      let count = files.length;
      const response = [];

      const countDown = () => {
        count--;

        if (count <= 0) {
          res.send(response);
        }
      };

      files.forEach(file => {
        const localMedia = mediaImageStore.data.find(item => item.file === file);

        if (localMedia) {
          response.push(localMedia);
          countDown();
        }
        else {
          uploadImage(mediaDir + file, (error, body) => {
            response.push({
              file,
              error,
              body
            });

            if (!error) {
              mediaImageStore.append({
                file,
                url: body.url,
                media_id: body.media_id,
              });
              mediaImageStore.flushSync();
            }

            countDown();
          });
        }
      });
    }
  });
});

mediaRouter.post('/news', function (req, res, next) {
  res.send('Not implemented')
});

mediaRouter.post('/kf', function (req, res, next) {

});

router.post('/menu', function (req, res, next) {
  accessTokenHelper.getAccessToken(token => {
    var menu = getCustomizedMenu();

    //create menu
    request.post(`https://api.weixin.qq.com/cgi-bin/menu/create?access_token=${token}`, {
      json: menu
    }, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        res.send({ body, status: 'success' });
      }
      else {
        res.send({ message: 'Failed to create customized menu', body });
      }
    });
  });
});

router.use('/media', mediaRouter);

module.exports = router;
