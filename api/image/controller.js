var gb = require('../../lib/gaborFilter.js');
var Image = require('./model.js');

/*
 Controller responsible for interacting with the gaborFilter module and
 storing the data.
 */


function gaborController() {


    //showes a specific image by it's properties.

    this.get = function (req, res, next) {
        var name = generateNameFromParams(req.query);

        Image.getAll()
            .then(function (images) {

                var img = images[name];
                if (img) {

                    res.locals.state = {
                        current: img,
                        currentName: name,
                        images: getSorted(images)
                    };

                    next();

                }
            });

    };

    //generating an image using the given params, in case it doesn't exist yet.
    this.generate = function (req, res, next) {

        var obj = req.query, name = generateNameFromParams(req.query);

        Image.get(name)
            .then(function (img) {
                if (img) {
                    next();
                    return Promise.reject(new Error('image already exists'));
                }
            })
            .then(function () {
                return gb(
                    parseInt(obj.orient),
                    parseInt(obj.size),
                    obj.env,
                    parseInt(obj.std),
                    parseFloat(obj.freq),
                    parseFloat(obj.phase),
                    obj.color0.split(',').map(function (val) {
                        return parseInt(val)
                    }),
                    obj.color1.split(',').map(function (val) {
                        return parseInt(val)
                    }),
                    obj.color2.split(',').map(function (val) {
                        return parseInt(val)
                    }),
                    name);

            })
            .then(function () {
                obj = Object.assign({url: '/images/' + name + '.png'}, obj);
                delete obj['username'];
                delete obj['password'];
                return Image.add(name, obj);
            })
            .then(function () {
                next();
            });


    };

    //a helper function returning uuid based on the given properties.

    function generateNameFromParams(obj) {

        var value, values = [];

        //sorting the keys so the id would not be affected by change in the properties order.
        var keys = Object.keys(obj).sort();

        keys.forEach(function (key) {

            //ignore keys that are not part of the image properties
            if (key != 'username' && key != 'password' && key != 'url') {
                value = obj[key];
                values.push(value);
            }
        });

        return values.join('-');
    }

    //prepares the image list to be presented in the view in a sorted manner.
    function getSorted(images) {

        for (var key in images) {
            images[key].name = key;
        }

        var values = Object.values(images)
            .sort(function (a, b) {
                if (a.id > b.id) {
                    return -1;
                }
                if (a.id < b.id) {
                    return 1;
                }
                return 0;
            });

        return values;
    }


}

module.exports = new gaborController;
