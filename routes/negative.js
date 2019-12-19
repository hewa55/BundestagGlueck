var express = require('express');
var router = express.Router();

/* GET negative page. */
router.get('/', function(req, res, next) {
  res.render('negative', { title: 'Stimmung im Bundestag' });
});
module.exports = router;
