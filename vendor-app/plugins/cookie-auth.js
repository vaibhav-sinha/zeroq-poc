var CookieAuth = require('hapi-auth-cookie');

exports.register = function(server, options, next) {

    server.register({ register: CookieAuth }, function(err) {

        server.auth.strategy('session', 'cookie', {
            password: 'secret',
            cookie: 'vendor-zeroq',
            redirectTo: '/login',
            isSecure: false
        });

        next()
    })
};

exports.register.attributes = {
    name : 'cookie-auth'
};