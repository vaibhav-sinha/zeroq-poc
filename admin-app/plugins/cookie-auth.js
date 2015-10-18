var CookieAuth = require('hapi-auth-cookie');

exports.register = function(server, options, next) {

    server.register({ register: CookieAuth }, function(err) {

        server.auth.strategy('session-admin', 'cookie', {
            password: 'secret',
            cookie: 'admin-zeroq',
            redirectTo: '/admin/login',
            isSecure: false
        });

        next()
    })
};

exports.register.attributes = {
    name : 'cookie-auth'
};