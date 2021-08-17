var express = require('express');
var router = express.Router();
const path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render(path.join(__dirname + '/../views/index.ejs'));
  res.render(path.join(__dirname + '/../ivrs/index.html'));
});

// callback function - directs back to home page
router.get('/callback', function(req, res, next) {
  // res.render(path.join(__dirname + '/../views/index.ejs'));
  res.render(path.join(__dirname + '/../ivrs/index.html'));
});

module.exports = router;
