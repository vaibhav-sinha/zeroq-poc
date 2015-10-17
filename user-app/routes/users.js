var UUID = require('node-uuid');
var Boom = require('boom');
var Async = require('async');

exports.register = function (server, options, next) {
    server.route({
        method: 'POST',
        path: '/register',
        handler: function (request, reply) {
            Async.waterfall([
                function(callback) {
                    server.seneca.act({role : 'user', cmd : 'get_by_id', id : request.payload.id}, function(err, result) {
                        if(err) {
                            return reply(Boom.badImplementation(err));
                        }
                        callback(null, result.answer);
                    });
                },
                function(existingUser, callback) {
                    var userToBeReturned;
                    if(!existingUser) {
                        var newUser = request.payload;
                        newUser['key'] = UUID.v4();
                        server.seneca.act({role : 'user', cmd : 'create_new', user : newUser}, function(err, result) {
                            if(err) {
                                return reply(Boom.badImplementation(err));
                            }
                            userToBeReturned = result;
                            callback(null, userToBeReturned);
                        });
                    }
                    else {
                        userToBeReturned = existingUser;
                        callback(null, userToBeReturned);
                    }
                }
            ], function(err, result) {
                return reply(result);
            });

        }
    });

    server.route({
        method: 'GET',
        path: '/me',
        config : {
            auth: 'simple',
            handler: function (request, reply) {
                reply(request.auth.credentials);
            }
        }
    });

    next();
};

exports.register.attributes = {
    name: 'user-controller',
    version: '1.0.0'
};