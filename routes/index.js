/********************************************************/
/***** Index Routes *****/
/********************************************************/
var express = require('express');
var router = express.Router();

/* GET Home Page */
router.get('/', function (req, res) {
    var user = req.session.user;

    if (typeof user === 'undefined') {
        res.render('index', {
            title: 'NEM'
        });
    } else {
        res.redirect('/dashboard')
    }
});

/* Login form POST */
router.post('/login', function (req, res) {
    var post = req.body;
    var models = req.Core.Models;
    var username = post.username;
    var password = post.password;

    models.Users.Login({username: username, password: password}, function (err, user) {
        if (err) {
            console.log(err)
            req.flash('error', 'Incorrect username or password');
            res.redirect('back');
        } else {
            req.session.user = user;
            res.redirect('/dashboard');
        }
    })
})

/* Get Reset Page */
router.get('/reset', function (req, res) {
    res.render('reset', {
        title: 'NEM'
    })
})

/* Post Reset Form */
router.post('/reset', function (req, res) {
    var post = req.body;
    var models = req.Core.Models;

    models.Users.ResetPassword({password: post.password}, function (err, reset) {
        if (err) {
            console.log(err)
        } else {
            console.log(reset)
        }
    })
})

module.exports = router;