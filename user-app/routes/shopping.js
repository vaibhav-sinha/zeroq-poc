var Boom = require('boom');
var Async = require('async');
var Joi = require('joi');

exports.register = function (server, options, next) {

    server.route({
        method: 'POST',
        path: '/start_shopping',
        config : {
            auth: 'simple',
            handler: function (request, reply) {
                var payloadSchema = Joi.object().keys({
                    cart_id: Joi.number().integer().required()
                });
                Joi.validate(request.payload, payloadSchema, {abortEarly : false, allowUnknown : true}, function(err, value) {
                    if(err) {
                        return reply(Boom.badData(err, request.payload));
                    }
                });
                var cart_id = request.payload.cart_id;
                var user_id = request.auth.credentials.id;
                var status = 'active';

                Async.waterfall([
                    function(callback) {
                        var query = [
                            {
                                cart_id : cart_id,
                                status : 'active'
                            },
                            {
                                cart_id : cart_id,
                                status : 'payment'
                            }
                        ];
                        server.shoppingService.act({role : 'shopping', cmd : 'search', query : query, page : 1, limit : 1}, function(err, result) {
                            if(err) {
                                return reply(Boom.badImplementation(err));
                            }
                            if(result.answer) {
                                var failure = {
                                    status : 'error',
                                    message : 'This cart is already in use. Please pick another cart'
                                };
                                return reply(failure);
                            }
                            callback(null, result);
                        })
                    },
                    function(shopping, callback) {
                        server.productService.act({role : 'cart', cmd : 'get_by_id', id : cart_id}, function(err, result) {
                            if(err) {
                                return reply(Boom.badImplementation(err));
                            }
                            callback(null, result.answer);
                        })
                    },
                    function(cart, callback) {
                        var store_id = cart.store_id;

                        var shopping = {
                            cart_id : cart_id,
                            user_id : user_id,
                            store_id : store_id,
                            status : status
                        };
                        server.shoppingService.act({role : 'shopping', cmd : 'create', data : shopping}, function(err, result) {
                            if(err) {
                                return reply(Boom.badImplementation(err));
                            }
                            callback(null, result.answer);
                        })
                    }
                ], function(err, result) {
                    var success = {
                        status : 'success',
                        shopping_id : result.id
                    };
                    reply(success);
                });
            },
            tags : ['api']
        }
    });

    server.route({
        method : 'POST',
        path : '/trigger_billing',
        config : {
            //auth : 'simple',
            handler : function(request, reply) {
                var payloadSchema = Joi.object().keys({
                    cart_id: Joi.number().integer().required()
                });
                Joi.validate(request.payload, payloadSchema, {abortEarly : false, allowUnknown : true}, function(err, value) {
                    if(err) {
                        return reply(Boom.badData(err, request.payload));
                    }
                });
                var cart_id = request.payload.cart_id;
                Async.waterfall([
                    function(callback) {
                        server.shoppingService.act({role: 'shopping', cmd : 'update_status', cart_id : cart_id, status : 'payment'}, function(err, result) {
                            if(err) {
                                var failure = {
                                    status: 'error',
                                    message: 'Could not start billing'
                                };
                                return reply(failure);
                            }
                            callback(null, result.answer);
                        })
                    },
                    function(shopping, callback) {
                        //Do actual billing related tasks here
                        server.shoppingService.act({role: 'shopping', cmd : 'update_status', cart_id : cart_id, status : 'idle'}, function(err, result) {
                            if(err) {
                                var failure = {
                                    status: 'error',
                                    message: 'Could not finish billing'
                                };
                                return reply(failure);
                            }
                            callback(null, result.answer);
                        })
                    }
                ], function(err, result) {
                    server.socket.emit('trigger_billing', "Ok");
                    var success = {
                        status : 'success'
                    };
                    reply(success);
                })
            },
            tags : ['api']
        }
    });

    server.route({
        method : 'POST',
        path : '/add_item',
        config : {
            //auth : 'simple',
            handler : function(request, reply) {
                var payloadSchema = Joi.object().keys({
                    cart_id: Joi.number().integer().required(),
                    tag_id: Joi.number().integer().required()
                });
                Joi.validate(request.payload, payloadSchema, {abortEarly : false, allowUnknown : true}, function(err, value) {
                    if(err) {
                        return reply(Boom.badData(err, request.payload));
                    }
                });
                var cart_id = request.payload.cart_id;
                var tag_id = request.payload.tag_id;
                Async.waterfall([
                    function (callback) {
                        var query = [
                            {
                                cart_id : cart_id,
                                status : 'active'
                            }
                        ];
                        server.shoppingService.act({role : 'shopping', cmd : 'search', query : query, page : 1, limit : 1}, function(err, result) {
                            if(err) {
                                return reply(Boom.badImplementation(err));
                            }
                            if(!result.answer) {
                                var failure = {
                                    status : 'error',
                                    message : 'You need to start shopping first by sending the cart id'
                                };
                                return reply(failure);
                            }
                            callback(null, result);
                        });
                    },
                    function (shopping, callback) {
                        server.productService.act({role : 'tag', cmd : 'get_association_by_tag_id', id: tag_id}, function(err, result) {
                            if(err) {
                                return reply(Boom.badImplementation(err));
                            }
                            if(!result.answer) {
                                return reply(Boom.expectationFailed("This tag is not associated with any product yet and hence cant be used for shopping", tag_id))
                            }
                            var item = {
                                shopping_id : shopping.id,
                                tag_id : tag_id,
                                product_id : result.answer.product_id
                            };
                            callback(null, item);
                        });
                    },
                    function (item, callback) {
                        server.shoppingService.act({role : 'shopping', cmd : 'add_item', shopping_id: item.shopping_id, tag_id : item.tag_id, product_id : item.product_id}, function(err, result) {
                            if(err) {
                                return reply(Boom.badImplementation(err));
                            }
                            callback(null, result.answer);
                        });
                    },
                    function (item, callback) {
                        server.productService.act({role : 'product', cmd : 'get_by_id', id : item.product_id}, function (err, result) {
                            if(err) {
                                return reply(Boom.badImplementation(err));
                            }
                            callback(null, result.answer);
                        })
                    }
                ], function (err, product) {
                    server.socket.emit('item_added', product);
                    reply("Ok");
                });
            },
            tags : ['api']
        }
    });

    next();
};

exports.register.attributes = {
    name: 'shopping-controller',
    version: '1.0.0'
};