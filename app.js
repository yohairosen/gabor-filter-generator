var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var image = require('./api/image');
var user = require('./api/user');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/api/user', user);
app.use('/api/image', image);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    if (err.status == 403) {
        res.redirect('/login');
    }
    else {

        // render the error page
        res.status(err.status || 500);
        res.render('error');
    }
});

module.exports = app;
