var Boom = require('boom');
var Async = require('async');
var Bcrypt = require('bcrypt');

exports.register = function (server, options, next) {
    server.route({
        method: 'POST',
        path: '/register',
        handler: function (request, reply) {
            Async.waterfall([
                function(callback) {
                    server.userService.act({role : 'admin', cmd : 'get_by_username', username : request.payload.username}, function(err, result) {
                        if(err) {
                            return reply(Boom.badImplementation(err));
                        }
                        callback(null, result.answer);
                    });
                },
                function(existingUser, callback) {
                    if(!existingUser) {
                        var newAdmin = request.payload;
                        Bcrypt.hash(newAdmin.password, 8, function(err, hash) {
                            newAdmin['password'] = hash;
                            server.userService.act({role : 'admin', cmd : 'create_new', admin : newAdmin}, function(err, result) {
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
                strategy: 'session-admin'
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

                var callback = function(message, admin) {
                    if (request.method === 'get' || message) {
                        return reply('<html><head><title>Login page</title></head><body>'
                            + (message ? '<h3>' + message + '</h3><br/>' : '')
                            + '<form method="post" action="/login">'
                            + 'Username: <input type="text" name="username"><br>'
                            + 'Password: <input type="password" name="password"><br/>'
                            + '<input type="submit" value="Login"></form></body></html>');
                    }

                    request.auth.session.set(admin);
                    return reply.redirect('/');
                };

                var message = '';
                var admin = null;

                if (request.method === 'post') {
                    if (!request.payload.username || !request.payload.password) {
                        message = 'Missing username or password';
                    }
                    else {
                        server.userService.act({role : 'admin', cmd : 'get_by_username', username : request.payload.username}, function(err, result) {
                            if(err) {
                                return reply(Boom.badImplementation(err));
                            }
                            admin = result.answer;
                            if(admin) {
                                Bcrypt.compare(request.payload.password, admin.password, function (err, isValid) {
                                    if (!isValid) {
                                        message = 'Invalid username or password';
                                    }
                                    callback(message, admin);
                                });
                            }
                            else {
                                message = 'Invalid username or password';
                                callback(message, admin);
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
            auth: 'session-admin',
            handler: function (request, reply) {
                reply(request.auth.credentials);
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/logout',
        config : {
            auth: 'session-admin',
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
    name: 'admin-controller',
    version: '1.0.0'
};