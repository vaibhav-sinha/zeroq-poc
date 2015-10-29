var Boom = require('boom');
var Async = require('async');
var Bcrypt = require('bcrypt');
var Joi = require('joi');

exports.register = function (server, options, next) {
    server.route({
        method: ['GET', 'POST'],
        path: '/register',
        handler: function (request, reply) {
            if(request.method === 'get') {
                return reply.file('./html/vendor_register.html');
            }
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
                    server.userService.act({role : 'vendor', cmd : 'get_by_username', username : request.payload.username}, function(err, result) {
                        if(err) {
                            return reply(Boom.badImplementation(err));
                        }
                        callback(null, result.answer);
                    });
                },
                function(existingUser, callback) {
                    if(!existingUser) {
                        var newVendor = request.payload;
                        Bcrypt.hash(newVendor.password, 8, function(err, hash) {
                            newVendor['password'] = hash;
                            server.userService.act({role : 'vendor', cmd : 'create_new', vendor : newVendor}, function(err, result) {
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
                strategy: 'session'
            },
            plugins: {
                'hapi-auth-cookie': {
                    redirectTo: false
                }
            },
            handler: function(request, reply) {
                if (request.auth.isAuthenticated) {
                    return reply.redirect(server.realm.modifiers.route.prefix + '/me');
                }

                var callback = function(message, vendor) {
                    if (request.method === 'get' || message) {
                        return reply.file('./html/vendor_register.html');
                    }

                    request.auth.session.set(vendor);
                    return reply.redirect(server.realm.modifiers.route.prefix + '/me');
                };

                var message = '';
                var vendor = null;

                if (request.method === 'post') {
                    if (!request.payload.username || !request.payload.password) {
                        message = 'Missing username or password';
                    }
                    else {
                        server.userService.act({role : 'vendor', cmd : 'get_by_username', username : request.payload.username}, function(err, result) {
                            if(err) {
                                return reply(Boom.badImplementation(err));
                            }
                            vendor = result.answer;
                            if(vendor) {
                                Bcrypt.compare(request.payload.password, vendor.password, function (err, isValid) {
                                    if (!isValid) {
                                        message = 'Invalid username or password';
                                    }
                                    callback(message, vendor);
                                });
                            }
                            else {
                                message = 'Invalid username or password';
                                callback(message, vendor);
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
            auth: 'session',
            handler: function (request, reply) {
                reply(request.auth.credentials);
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/logout',
        config : {
            auth: 'session',
            handler: function (request, reply) {
                request.auth.session.clear();
                return reply.redirect(server.realm.modifiers.route.prefix + '/login');
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
    name: 'vendor-controller',
    version: '1.0.0'
};
