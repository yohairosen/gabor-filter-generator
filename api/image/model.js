var storage = require('../../lib/jsonStorage.js')('storage');

/*
 Module responsible for storing and retrieving the image data
 */


function imageModel() {

    this.add = function (name, value) {
        return storage.add(name, value, 'images');
    };


    this.get = function (name) {

        return storage.get()
            .then(function (data) {
                return data.images[name];
            }, function () {
                return null;
            })
    };

    this.getAll = function () {

        return storage.get()
            .then(function (data) {
                return data.images;
            }, function () {
                return {};
            })
    }


}

module.exports = new imageModel;
