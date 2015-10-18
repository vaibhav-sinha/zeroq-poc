var CookieAuth = require('hapi-auth-cookie');

exports.register = function(server, options, next) {

    server.register({ register: CookieAuth }, function(err) {

        server.auth.strategy('session-vendor', 'cookie', {
            password: 'secret',
            cookie: 'vendor-zeroq',
            redirectTo: '/vendor/login',
            isSecure: false
        });

        server.auth.strategy('session-store', 'cookie', {
            password: 'secret',
            cookie: 'store-zeroq',
            redirectTo: '/store/login',
            isSecure: false
        });

        next()
    })
};

exports.register.attributes = {
    name : 'cookie-auth'
};