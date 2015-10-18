var model = require('./../model');

module.exports = function shopping_service( options ) {

    this.add( 'role:shopping, cmd:search', function get( msg, respond ) {
        var query = msg.query;
        var page = msg.page;
        var limit = msg.limit;

        var qb = model.Shopping.query();
        if(query instanceof Array) {
            var first = true;
            for(q in query) {
                if(first) {
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
        qb = qb.limit(limit).offset((page - 1) * limit);
        qb.fetch().then(function(shoppingList) {
            respond(null, {answer: shoppingList});
        }).catch(function(error) {
            console.error(error);
        });
    });

    this.add( 'role:shopping, cmd:get_by_id', function get( msg, respond ) {
        model.Shopping.where('id', msg.id).fetch().then(function(shopping) {
            respond(null, {answer: shopping});
        }).catch(function(error) {
            console.error(error);
        });
    });

    this.add( 'role:shopping, cmd:create', function get( msg, respond ) {
        new model.Shopping().save(msg.data, {method: 'insert'}).then(function(shopping) {
            respond(null, {answer: shopping});
        }).catch(function(error) {
            console.error(error);
        });
    });

    this.add( 'role:shopping, cmd:update', function get( msg, respond ) {
        new model.Shopping().save(msg.data, {method: 'update'}).then(function(shopping) {
            respond(null, {answer: shopping});
        }).catch(function(error) {
            console.error(error);
        });
    });

    this.add( 'role:shopping, cmd:add_item', function get( msg, respond ) {
        var entry = {
            shopping_id : msg.shopping_id,
            tag_id : msg.tag_id,
            product_id : msg.product_id
        };
        model.ShoppingItems.query(entry).then(function(shoppingItem){
            if(shoppingItem) {
                shoppingItem.active = true;
                new model.ShoppingItems().save(shoppingItem, {method: 'update'}).then(function (item) {
                    respond(null, {answer: item});
                }).catch(function (error) {
                    console.error(error);
                });
            }
            else {
                entry.active = true;
                new model.ShoppingItems().save(entry, {method: 'insert'}).then(function (item) {
                    respond(null, {answer: item});
                }).catch(function (error) {
                    console.error(error);
                });
            }
        }).catch(function(error){
            console.error(error);
        });
    });

    this.add( 'role:shopping, cmd:remove_item', function get( msg, respond ) {
        var entry = {
            shopping_id : msg.shopping_id,
            tag_id : msg.tag_id,
            product_id : msg.product_id,
            active : true
        };
        model.ShoppingItems.query(entry).then(function(shoppingItem){
            shoppingItem.active = false;
            new model.ShoppingItems().save(shoppingItem, {method: 'update'}).then(function(shopping) {
                respond(null, {answer: shopping});
            }).catch(function(error) {
                console.error(error);
            });
        }).catch(function(error){
            console.error(error);
        });
    });

    this.add( 'role:shopping, cmd:get_association_by_shopping_id', function get( msg, respond ) {
        model.ShoppingStoreProductMapping.where('shopping_id', msg.id).fetch().then(function(association) {
            respond(null, {answer: association});
        }).catch(function(error) {
            console.error(error);
        });
    });

};