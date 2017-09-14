var express = require('express');
var router = express.Router();
var controller = require('./controller.js');
var querystring = require('querystring').stringify;
var auth = require('../../lib/auth.js');

/*
 Module responsible for routing and rendering the view
 */


router.get('/', auth, controller.get, render);

router.get('/generate', auth, controller.generate, function (req, res) {

    //show the newly created image
    res.redirect('/api/image/?' + querystring(req.query));
});

function render(req, res) {

    //sustain the auth params
    res.locals.state.username = req.query.username;
    res.locals.state.password = req.query.password;

    res.render('index', res.locals.state);
}

module.exports = router;
