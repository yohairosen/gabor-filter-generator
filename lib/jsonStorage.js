var fs = require('fs');


/*
 Module responsible for creating json files, managing writing and reading data.
 */


function jsonStorage(name) {


    this.get = function () {

        return readFilePro(name + '.json', 'utf8')
            .then(function (data) {
                return JSON.parse(data);
            });
    };

    this.add = function (key, value, table) {

        //store the given data in a table. In case table doesn't exist yet, create it.
        return this.get()
            .then(function (storage) {

                value.id = storage.count;
                storage[table][key] = value;
                storage.count++;

                return storage;

            }, function (err) {

                value.id = 0;
                return {
                    count: 1,
                    [table]: {
                        [key]: value
                    }
                };
            })
            .then(function (storage) {
                return writeFilePro('storage.json', JSON.stringify(storage), 'utf8').then(function () {
                    return storage;
                });
            });


    };


    //wrap in promises

    function readFilePro(filename, encoding) {
        return new Promise(function (resolve, reject) {
            fs.readFile(filename, encoding, (err, data) => {
                if (err) reject(err);
                resolve(data);
            });
        })
    }

    function writeFilePro(filename, data, encoding) {
        return new Promise(function (resolve, reject) {
            fs.writeFile(filename, data, encoding, (err, data) => {
                if (err) reject(err);
                resolve(data);
            })
        })
    }


}

module.exports = function(name){
    return new jsonStorage(name);
};
