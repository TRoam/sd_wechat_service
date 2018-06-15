var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/oauth', function (req, res, next) {
  res.send({
    body: req.body,
    url: req.url,
    originalUrl: req.originalUrl
  });
});

module.exports = router;
