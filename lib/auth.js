var usersStore = require('./jsonStorage.js')('users');

/*
 Helper module for validating access by comparing the user on the request against the
 users store.
 */


module.exports = function auth(req, res, next) {
    usersStore.get()
        .then(function (data) {
            var currUser;
            for (var i = 0; i < data.users.length; i++) {
                currUser = data.users[i];
                if (currUser.username == req.query.username
                    && currUser.password == req.query.password) {
                    return next();
                }
            }

            var err = new Error('Forbidden');
            err.status = 403;
            return next(err);
        });
};
