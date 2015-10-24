var UUID = require('node-uuid');
var Boom = require('boom');
var Async = require('async');
var Joi = require('joi');

exports.register = function (server, options, next) {
    server.route({
        method: 'POST',
        path: '/register',
        config : {
            handler: function (request, reply) {
                var payloadSchema = Joi.object().keys({
                    id: Joi.number().integer().required(),
                    name: Joi.string().alphanum().required()
                });
                Joi.validate(request.payload, payloadSchema, {abortEarly : false, allowUnknown : true}, function(err, value) {
                    if(err) {
                        return reply(Boom.badData(err, request.payload));
                    }
                });
                Async.waterfall([
                    function (callback) {
                        server.userService.act({
                            role: 'user',
                            cmd: 'get_by_id',
                            id: request.payload.id
                        }, function (err, result) {
                            if (err) {
                                return reply(Boom.badImplementation(err));
                            }
                            callback(null, result.answer);
                        });
                    },
                    function (existingUser, callback) {
                        var userToBeReturned;
                        if (!existingUser) {
                            var newUser = request.payload;
                            newUser['key'] = UUID.v4();
                            server.userService.act({role: 'user', cmd: 'create_new', user: newUser}, function (err, result) {
                                if (err) {
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
                ], function (err, result) {
                    return reply(result);
                });
            },
            tags : ['api']
        }
    });

    server.route({
        method: 'GET',
        path: '/me',
        config : {
            auth: 'simple',
            handler: function (request, reply) {
                reply(request.auth.credentials);
            },
            tags : ['api']
        }
    });

    next();
};

exports.register.attributes = {
    name: 'user-controller',
    version: '1.0.0'
};