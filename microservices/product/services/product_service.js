var model = require('./../model');

module.exports = function product_service( options ) {

    this.add( 'role:product, cmd:search', function get( msg, respond ) {
        var query = msg.query;
        var page = msg.page;
        var limit = msg.limit;

        var qb = model.Product.query();
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
        qb.fetch().then(function(productList) {
            respond(null, {answer: productList});
        }).catch(function(error) {
            respond(error, null);
        });
    });

    this.add( 'role:product, cmd:get_by_id', function get( msg, respond ) {
        model.Product.where('id', msg.id).fetch().then(function(product) {
            respond(null, {answer: product});
        }).catch(function(error) {
            respond(error, null);
        });
    });

    this.add( 'role:product, cmd:create', function get( msg, respond ) {
        new model.Product().save(msg.data, {method: 'insert'}).then(function(product) {
            respond(null, {answer: product});
        }).catch(function(error) {
            respond(error, null);
        });
    });

    this.add( 'role:product, cmd:update', function get( msg, respond ) {
        new model.Product().save(msg.data, {method: 'update'}).then(function(product) {
            respond(null, {answer: product});
        }).catch(function(error) {
            respond(error, null);
        });
    });

    this.add( 'role:product, cmd:delete', function get( msg, respond ) {
        msg.product['active'] = false;
        new model.Product().save(msg.data, {method: 'update'}).then(function(product) {
            respond(null, {answer: product});
        }).catch(function(error) {
            respond(error, null);
        });
    });

};