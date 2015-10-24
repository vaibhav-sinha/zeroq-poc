var Boom = require('boom');
var Async = require('async');
var Joi = require('joi');

exports.register = function (server, options, next) {

    server.route({
        method: 'GET',
        path: '/{id}',
        config : {
            auth: 'session-store',
            handler: function (request, reply) {
                server.productService.act({role : 'product', cmd : 'get_by_id', id : request.params.id}, function(err, result) {
                    if(err) {
                        return reply(Boom.badImplementation(err));
                    }
                    if(!result.answer || result.answer.store_id == request.auth.credentials.id) {
                        reply(result.answer);
                    }
                    else {
                        reply(Boom.forbidden('The requested product does not belong to your store', {id : request.params.id}))
                    }
                });
            }
        }
    });

    server.route({
        method: 'POST',
        path: '/search',
        config : {
            auth: 'session-store',
            handler: function (request, reply) {
                var payloadSchema = Joi.object().keys({
                    page: Joi.number().integer().required(),
                    limit: Joi.number().integer().required(),
                    query: Joi.object().required()
                });
                Joi.validate(request.payload, payloadSchema, {abortEarly : false, allowUnknown : true}, function(err, value) {
                    if(err) {
                        return reply(Boom.badData(err, request.payload));
                    }
                });
                var query = request.payload.query;
                var page = request.payload.page;
                var limit = request.payload.limit;

                if(query instanceof Array) {
                    for(q in query) {
                        q['store_id'] = request.auth.credentials.id;
                    }
                }
                else {
                    query['store_id'] = request.auth.credentials.id;
                }

                server.productService.act({role : 'product', cmd : 'search', query : query, page : page, limit : limit}, function(err, result) {
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
            auth: 'session-store',
            handler: function (request, reply) {
                var product = request.payload;
                product.store_id = request.auth.credentials.id;
                server.productService.act({role: 'product', cmd: 'create', product: product}, function (err, result) {
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
            auth: 'session-store',
            handler: function (request, reply) {
                var product = request.payload;
                product.store_id = request.auth.credentials.id;
                server.productService.act({role: 'product', cmd: 'update', product: product}, function (err, result) {
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
            auth: 'session-store',
            handler: function (request, reply) {
                var product = request.payload;
                product.store_id = request.auth.credentials.id;
                server.productService.act({role: 'product', cmd: 'delete', product: product}, function (err, result) {
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
    name: 'product-controller',
    version: '1.0.0'
};