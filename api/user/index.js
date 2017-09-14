var express = require('express');
var router = express.Router();
var querystring = require('querystring');
var auth = require('../../lib/auth.js');

/*
 Module responsible for exposing the login api
 */


router.get('/login', auth, function (req, res, next) {
    res.redirect('/?' + querystring.stringify(req.query));
});



module.exports = router;
