/********************************************************/
/***** Dashboard Routes *****/
/********************************************************/
var express = require('express');
var router = express.Router();

/* GET Dashboard Page */
router.get('/', function (req, res, next) {
    res.render('dashboard', {
        title: 'NEM',
        styles: ['/css/sb-admin.css'],
        scripts: ['/js/sb-admin.min.js']
    });
});

module.exports = router;