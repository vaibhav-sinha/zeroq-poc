var model = require('./model');

module.exports = function user_service( options ) {

    this.add( 'role:user, cmd:get_by_id', function get( msg, respond ) {
        model.User.where('id', msg.id).fetch().then(function(user) {
            respond(null, {answer: user});
        }).catch(function(error) {
            console.error(error);
        });
    });

    this.add( 'role:user, cmd:create_new', function get( msg, respond ) {
        new model.User(msg.user).save().then(function(user) {
            respond(null, {answer: user});
        }).catch(function(error) {
            console.error(error);
        });
    });

};