var model = require('./../model');
var Async = require('async');

module.exports = function shopping_service( options ) {

    this.add( 'role:shopping, cmd:search', function get( msg, respond ) {
        var query = msg.query;
        var page = msg.page;
        var limit = msg.limit;

        model.Shopping.query(function(qb) {
            if(query instanceof Array) {
                var len = query.length;
                for(var i = 0; i < len; i++) {
                    var q = query[i];
                    if(i == 0) {
                        qb = qb.where(q);
                    }
                    else {
                        qb = qb.orWhere(q);
                    }
                }
            }
            else {
                qb = qb.where(query);
            }
            qb.limit(limit).offset((page - 1) * limit);
        }).fetch().then(function(shoppingList) {
            respond(null, {answer: shoppingList});
        }).catch(function(error) {
            respond(error, null);
        });
    });

    this.add( 'role:shopping, cmd:get_by_id', function get( msg, respond ) {
        model.Shopping.where('id', msg.id).fetch().then(function(shopping) {
            respond(null, {answer: shopping});
        }).catch(function(error) {
            respond(error, null);
        });
    });

    this.add( 'role:shopping, cmd:create', function get( msg, respond ) {
        new model.Shopping().save(msg.data, {method: 'insert'}).then(function(shopping) {
            respond(null, {answer: shopping});
        }).catch(function(error) {
            respond(error, null);
        });
    });

    this.add( 'role:shopping, cmd:update', function get( msg, respond ) {
        new model.Shopping().save(msg.data, {method: 'update'}).then(function(shopping) {
            respond(null, {answer: shopping});
        }).catch(function(error) {
            respond(error, null);
        });
    });

    this.add( 'role:shopping, cmd:add_item', function get( msg, respond ) {
        var entry = {
            shopping_id : msg.shopping_id,
            tag_id : msg.tag_id,
            product_id : msg.product_id
        };
        model.ShoppingItems.query({where : entry}).fetch().then(function(shoppingItem) {
            if(shoppingItem) {
                shoppingItem.active = true;
                new model.ShoppingItems().save(shoppingItem, {method: 'update'}).then(function (item) {
                    respond(null, {answer: item});
                }).catch(function (error) {
                    respond(error, null);
                });
            }
            else {
                entry.active = true;
                new model.ShoppingItems().save(entry, {method: 'insert'}).then(function (item) {
                    respond(null, {answer: item});
                }).catch(function (error) {
                    respond(error, null);
                });
            }
        }).catch(function(error){
            respond(error, null);
        });
    });

    this.add( 'role:shopping, cmd:remove_item', function get( msg, respond ) {
        var entry = {
            shopping_id : msg.shopping_id,
            tag_id : msg.tag_id,
            product_id : msg.product_id,
            active : true
        };
        model.ShoppingItems.query({where : entry}).fetch().then(function(shoppingItem){
            shoppingItem.active = false;
            new model.ShoppingItems().save(shoppingItem, {method: 'update'}).then(function(shopping) {
                respond(null, {answer: shopping});
            }).catch(function(error) {
                respond(error, null);
            });
        }).catch(function(error){
            respond(error, null);
        });
    });

    this.add( 'role:shopping, cmd:get_association_by_shopping_id', function get( msg, respond ) {
        model.ShoppingStoreProductMapping.where('shopping_id', msg.id).fetch().then(function(association) {
            respond(null, {answer: association});
        }).catch(function(error) {
            respond(error, null);
        });
    });

    this.add( 'role:shopping, cmd:update_status', function get( msg, respond ) {
        Async.waterfall([
            function(callback) {
                model.Shopping.query().where({cart_id : msg.cart_id}).fetch(shopping).then(function() {
                    callback(null, shopping);
                }).catch(function(error) {
                    callback(error, null);
                })
            },
            function(shopping, callback) {
                shopping['status'] = msg.status;
                new model.Shopping().save(shopping, {method: 'update'}).then(function(shopping) {
                    callback(null, {answer: shopping});
                }).catch(function(error) {
                    callback(error, null);
                });
            }
        ], function(err, result) {
            respond(err, result);
        });
    });

};