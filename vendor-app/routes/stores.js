var UUID = require('node-uuid');
var Boom = require('boom');
var Async = require('async');
var Bcrypt = require('bcrypt');
var Joi = require('joi');

exports.register = function (server, options, next) {
    server.route({
        method: 'POST',
        path: '/register',
        handler: function (request, reply) {
            var payloadSchema = Joi.object().keys({
                username: Joi.string().alphanum().required(),
                password: Joi.string().alphanum().required()
            });
            Joi.validate(request.payload, payloadSchema, {abortEarly : false, allowUnknown : true}, function(err, value) {
                if(err) {
                    return reply(Boom.badData(err, request.payload));
                }
            });
            Async.waterfall([
                function(callback) {
                    server.userService.act({role : 'store', cmd : 'get_by_username', username : request.payload.username}, function(err, result) {
                        if(err) {
                            return reply(Boom.badImplementation(err));
                        }
                        callback(null, result.answer);
                    });
                },
                function(existingUser, callback) {
                    if(!existingUser) {
                        var newStore = request.payload;
                        Bcrypt.hash(newStore.password, 8, function(err, hash) {
                            newStore['password'] = hash;
                            server.userService.act({role : 'store', cmd : 'create_new', store : newStore}, function(err, result) {
                                if(err) {
                                    return reply(Boom.badImplementation(err));
                                }
                                callback(null, result.answer);
                            });
                        });
                    }
                    else {
                        message = "User with this username already exists. Please try another username";
                        callback(null, message);
                    }
                }
            ], function(err, result) {
                return reply(result);
            });

        }
    });

    server.route({
        method: ['GET', 'POST'],
        path: '/login',
        config: {
            auth: {
                mode: 'try',
                strategy: 'session-store'
            },
            plugins: {
                'hapi-auth-cookie': {
                    redirectTo: false
                }
            },
            handler: function(request, reply) {
                if (request.auth.isAuthenticated) {
                    return reply.redirect('/');
                }

                var callback = function(message, store) {
                    if (request.method === 'get' || message) {
                        return reply('<html><head><title>Login page</title></head><body>'
                            + (message ? '<h3>' + message + '</h3><br/>' : '')
                            + '<form method="post" action="/login">'
                            + 'Username: <input type="text" name="username"><br>'
                            + 'Password: <input type="password" name="password"><br/>'
                            + '<input type="submit" value="Login"></form></body></html>');
                    }

                    request.auth.session.set(store);
                    return reply.redirect('/');
                };

                var message = '';
                var store = null;

                if (request.method === 'post') {
                    if (!request.payload.username || !request.payload.password) {
                        message = 'Missing username or password';
                    }
                    else {
                        server.userService.act({role : 'store', cmd : 'get_by_username', username : request.payload.username}, function(err, result) {
                            if(err) {
                                return reply(Boom.badImplementation(err));
                            }
                            store = result.answer;
                            if(store) {
                                Bcrypt.compare(request.payload.password, store.password, function (err, isValid) {
                                    if (!isValid) {
                                        message = 'Invalid username or password';
                                    }
                                    callback(message, store);
                                });
                            }
                            else {
                                message = 'Invalid username or password';
                                callback(message, store);
                            }
                        });
                    }
                }
                else {
                    callback(null, null);
                }
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/me',
        config : {
            auth: 'session-store',
            handler: function (request, reply) {
                reply(request.auth.credentials);
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/logout',
        config : {
            auth: 'session-store',
            handler: function (request, reply) {
                request.auth.session.clear();
                return reply.redirect('/');
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/',
        config : {
            handler: function (request, reply) {
                return reply('Welcome to zeroQ');
            }
        }
    });

    next();
};

exports.register.attributes = {
    name: 'store-controller',
    version: '1.0.0'
};