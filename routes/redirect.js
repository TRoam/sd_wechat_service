const express = require('express');
const router = express.Router();
const config = require('../config');

const excelsiorSupportUrl = `${config.excelsiorServer}/wechat_service/_test_/news?link=2Ftopic%2Fah4AyG4cgiMJhNxvHhTZjB%2Fsony%2Fi-need-support%2Fnew%3Ftype%3Dquestion`

/* GET home page. */
router.get('/', function (req, res, next) {
  const { type } = req.query;

  if (type == 'support') {
    res.redirect(excelsiorSupportUrl);
  }
  else {
    res.send({
      body: req.body,
      url: req.url,
    });
  }
});

module.exports = router;
