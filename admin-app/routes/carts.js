var Boom = require('boom');
var Async = require('async');

exports.register = function (server, options, next) {

    server.route({
        method: 'GET',
        path: '/{id}',
        config : {
            auth: 'session-admin',
            handler: function (request, reply) {
                server.productService.act({role : 'cart', cmd : 'get_by_id', id : request.params.id}, function(err, result) {
                    if(err) {
                        return reply(Boom.badImplementation(err));
                    }
                    reply(result.answer);
                });
            }
        }
    });

    server.route({
        method: 'POST',
        path: '/search',
        config : {
            auth: 'session-admin',
            handler: function (request, reply) {
                var query = request.payload.query;
                var page = request.payload.page;
                var limit = request.payload.limit;

                server.productService.act({role : 'cart', cmd : 'search', query : query, page : page, limit : limit}, function(err, result) {
                    if(err) {
                        return reply(Boom.badImplementation(err));
                    }
                    return reply(result.answer);
                });
            }
        }
    });

    server.route({
        method: 'POST',
        path: '/create',
        config: {
            auth: 'session-admin',
            handler: function (request, reply) {
                var cart = request.payload.cart;
                server.productService.act({role: 'cart', cmd: 'create', cart: cart}, function (err, result) {
                    if (err) {
                        return reply(Boom.badImplementation(err));
                    }
                    return reply(result.answer);
                });
            }
        }
    });

    server.route({
        method: 'POST',
        path: '/update',
        config: {
            auth: 'session-admin',
            handler: function (request, reply) {
                var cart = request.payload.cart;
                server.productService.act({role: 'cart', cmd: 'update', cart: cart}, function (err, result) {
                    if (err) {
                        return reply(Boom.badImplementation(err));
                    }
                    return reply(result.answer);
                });
            }
        }
    });

    server.route({
        method: 'POST',
        path: '/delete',
        config : {
            auth: 'session-admin',
            handler: function (request, reply) {
                var cart = request.payload.cart;
                server.productService.act({role: 'cart', cmd: 'delete', cart: cart}, function (err, result) {
                    if (err) {
                        return reply(Boom.badImplementation(err));
                    }
                    return reply(result.answer);
                });
            }
        }
    });

    next();
};

exports.register.attributes = {
    name: 'cart-controller',
    version: '1.0.0'
};