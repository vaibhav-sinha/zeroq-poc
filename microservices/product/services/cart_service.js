var model = require('./../model');

module.exports = function cart_service( options ) {

    this.add( 'role:cart, cmd:search', function get( msg, respond ) {
        var query = msg.query;
        var page = msg.page;
        var limit = msg.limit;

        var qb = model.Cart.query();
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
        qb.fetch().then(function(cartList) {
            respond(null, {answer: cartList});
        }).catch(function(error) {
            console.error(error);
        });
    });

    this.add( 'role:cart, cmd:get_by_id', function get( msg, respond ) {
        model.Cart.where('id', msg.id).fetch().then(function(cart) {
            respond(null, {answer: cart});
        }).catch(function(error) {
            console.error(error);
        });
    });

    this.add( 'role:cart, cmd:create', function get( msg, respond ) {
        new model.Cart().save(msg.cart, {method: 'insert'}).then(function(cart) {
            respond(null, {answer: cart});
        }).catch(function(error) {
            console.error(error);
        });
    });

    this.add( 'role:cart, cmd:update', function get( msg, respond ) {
        new model.Cart().save(msg.cart, {method: 'update'}).then(function(cart) {
            respond(null, {answer: cart});
        }).catch(function(error) {
            console.error(error);
        });
    });

    this.add( 'role:cart, cmd:delete', function get( msg, respond ) {
        msg.cart['active'] = false;
        new model.Cart().save(msg.cart, {method: 'update'}).then(function(cart) {
            respond(null, {answer: cart});
        }).catch(function(error) {
            console.error(error);
        });
    });

};