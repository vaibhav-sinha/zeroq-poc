var BearerTokenAuth = require('hapi-auth-bearer-token');

exports.register = function(server, options, next) {

    server.register({ register: BearerTokenAuth }, function(err) {

        server.auth.strategy('simple', 'bearer-access-token', {
            allowQueryToken: true,              // optional, true by default
            allowMultipleHeaders: false,        // optional, false by default
            accessTokenName: 'access_token',    // optional, 'access_token' by default
            validateFunc: function( token, callback ) {
                server.seneca.act({role : 'user', cmd : 'get_by_key', key : token}, function(err, result) {
                    if(result.answer) {
                        callback(null,true, result.answer);
                    }
                    else {
                        callback(err, false, null);
                    }
                });
            }
        });

        next()
    })
};

exports.register.attributes = {
    name : 'access-token-auth'
};