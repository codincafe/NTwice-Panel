/********************************************************/
/***** Custom Requires *****/
/********************************************************/
var config = require('./config');

/********************************************************/
/***** Node Modules *****/
/********************************************************/
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var moment = require('moment-timezone');
var csrf = require('csurf');
var fileUpload = require('express-fileupload');
var flash = require('express-flash');

/********************************************************/
/***** Require Routes *****/
/********************************************************/
var index = require('./routes/index');
var dashboard = require('./routes/dashboard');

/********************************************************/
/***** Spawn Express App *****/
/********************************************************/
var app = express();

/********************************************************/
/***** Set View Engine For Express. *****/
/***** '/views' folder acts as *****/
/***** theme folder *****/
/********************************************************/
app.engine('.html', require('ejs').__express);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

/********************************************************/
/***** Configure Middlewares *****/
/********************************************************/
app.use(favicon(__dirname + '/public/images/favicon.ico'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());
app.use(flash());

/* Configure Sessions in MySQL */
app.use(session({
    secret: '40ysiT8_4>/^xny9F4tgjuxVC`:E59',
    resave: true,
    saveUninitialized: true,
    cookie: {maxAge: 3600000 * 12} /* Expire session in 12 hours */
}));

/********************************************************/
/***** API Route (Without CSRF) *****/
/********************************************************/
var api = require('./routes/api');
app.use('/api', api);

/********************************************************/
/***** Init CSRF *****/
/********************************************************/
app.use(csrf());

/********************************************************/
/***** Setup local functions *****/
/********************************************************/
app.use(function (req, res, next) {
    // req.Core = {
    //     Models: require('./models'),
    //     ErrorCodes: require('./errorCodes')
    // };
    res.locals.session = req.session;
    res.locals._csrf = req.csrfToken();
    res.locals.csrf_html = '<input type="hidden" value="' + req.csrfToken() + '" name="_csrf" />';
    res.locals.formatDate = function (date, format) {
        var fDate = moment(date).format(format);
        return (fDate === 'Invalid date') ? '' : fDate;
    };
    res.locals.addStyle = function (styles) {
        var dep = '';
        if (typeof styles !== 'undefined') {
            styles.forEach(function (style) {
                dep += '<link rel="stylesheet" href="' + style + '">'
            })
        }
        return dep;
    }
    res.locals.addScript = function (script) {
        var dep = '';
        if (typeof script !== 'undefined') {
            script.forEach(function (script) {
                dep += '<script src="' + script + '"></script>'
            })
        }
        return dep;
    }
    next();
});

/********************************************************/
/******* Use this function as middleware in Route *******/
/******* to allow access to sessioned users *************/
/********************************************************/
function checkAuth(req, res, next) {
    if (!req.session.user) {
        res.redirect('/403');
    } else {
        next();
    }
}

/********************************************************/
/***** Define Routes *****/
/********************************************************/
/* APP ROUTES */
app.use('/', index);
app.use('/dashboard', checkAuth, dashboard);

/********************************************************/
/***** Logout and destroy all set sessions *****/
/********************************************************/
app.use('/logout', function (req, res) {
    req.session.destroy();
    res.redirect('/');
});

/********************************************************/
/***** Handle 404 Template *****/
/********************************************************/
app.use('/404', function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/********************************************************/
/***** Handle 403 Template *****/
/********************************************************/
app.use('/403', function (req, res, next) {
    res.status(403)
    res.render('unauthorized', {
        title: 'Unauthorized Access - Mercury'
    });
});

/********************************************************/
/***** Error Handlers *****/
/********************************************************/
if (config.app.env !== 'dev') {
    app.use(function (req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            title: 'Error',
            status: err.status,
            message: err.message,
            error: err
        });
    });
}

/********************************************************/
/***** Start Node app *****/
/********************************************************/
app.set('port', process.env.PORT || config.app.port);
var server = app.listen(app.get('port'), function () {
    console.log("UI started on Port " + app.get('port'));
});