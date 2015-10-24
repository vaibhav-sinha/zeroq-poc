var model = require('../model');

module.exports = function vendor_service( options ) {

    this.add( 'role:vendor, cmd:get_by_username', function get( msg, respond ) {
        model.Vendor.where('username', msg.username).fetch().then(function(vendor) {
            respond(null, {answer: vendor});
        }).catch(function(error) {
            respond(error, null);
        });
    });

    this.add( 'role:vendor, cmd:create_new', function get( msg, respond ) {
        new model.Vendor().save(msg.vendor, {method: 'insert'}).then(function(vendor) {
            respond(null, {answer: vendor});
        }).catch(function(error) {
            respond(error, null);
        });
    });

    this.add( 'role:store, cmd:get_by_username', function get( msg, respond ) {
        model.Store.where('username', msg.username).fetch().then(function(store) {
            respond(null, {answer: store});
        }).catch(function(error) {
            respond(error, null);
        });
    });

    this.add( 'role:store, cmd:create_new', function get( msg, respond ) {
        new model.Store().save(msg.store, {method: 'insert'}).then(function(store) {
            respond(null, {answer: store});
        }).catch(function(error) {
            respond(error, null);
        });
    });

};