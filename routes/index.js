var express = require('express');
var router = express.Router();
var storage = require('../lib/jsonStorage.js')('storage');
var querystring = require('querystring').stringify;

const defaultValues = {
    orient: 45,
    size: 100,
    env: "circle",
    std: 23,
    freq: 0.1,
    phase: 12,
    color0: "128,128,128",
    color1: "255,255,255",
    color2: "0,0,0"};


router.get('/login', function (req, res, next) {
    res.render('login');
});

router.get('/', function (req, res, next) {

    storage.get()
        .then(function (data) {
            res.redirect('api/image?' + querystring(Object.assign(defaultValues, req.query)));
        }, function () {
            res.redirect('/api/image/generate?' + querystring(Object.assign(defaultValues, req.query)));
        });


});

module.exports = router;
