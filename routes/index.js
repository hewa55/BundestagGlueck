var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Negativ im Bundestag' });
});
router.get('/negative', function(req, res, next) {
  res.render('negative', { title: 'Negativ im Bundestag' });
});


module.exports = router;
