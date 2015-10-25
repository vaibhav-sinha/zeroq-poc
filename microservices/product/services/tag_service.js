var model = require('./../model');

module.exports = function tag_service( options ) {

    this.add( 'role:tag, cmd:search', function get( msg, respond ) {
        var query = msg.query;
        var page = msg.page;
        var limit = msg.limit;

        model.Tag.query(function(qb) {
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
        }).fetch().then(function(tagList) {
            respond(null, {answer: tagList});
        }).catch(function(error) {
            respond(error, null);
        });
    });

    this.add( 'role:tag, cmd:get_by_id', function get( msg, respond ) {
        model.Tag.where('id', msg.id).fetch().then(function(tag) {
            respond(null, {answer: tag});
        }).catch(function(error) {
            respond(error, null);
        });
    });

    this.add( 'role:tag, cmd:create', function get( msg, respond ) {
        new model.Tag().save(msg.data, {method: 'insert'}).then(function(tag) {
            respond(null, {answer: tag});
        }).catch(function(error) {
            respond(error, null);
        });
    });

    this.add( 'role:tag, cmd:update', function get( msg, respond ) {
        new model.Tag().save(msg.data, {method: 'update'}).then(function(tag) {
            respond(null, {answer: tag});
        }).catch(function(error) {
            respond(error, null);
        });
    });

    this.add( 'role:tag, cmd:associate', function get( msg, respond ) {
        var entry = {
            tag_id : msg.tag_id,
            store_id : msg.store_id,
            product_id : msg.product_id
        };
        new model.TagStoreProductMapping().save(entry, {method: 'insert'}).then(function(tag) {
            respond(null, {answer: tag});
        }).catch(function(error) {
            respond(error, null);
        });
    });

    this.add( 'role:tag, cmd:get_association_by_tag_id', function get( msg, respond ) {
        model.TagStoreProductMapping.where('tag_id', msg.id).fetch().then(function(association) {
            respond(null, {answer: association});
        }).catch(function(error) {
            respond(error, null);
        });
    });

};