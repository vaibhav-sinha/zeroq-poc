var Hapi            = require('hapi'),
    Pack            = require('./package'),
    Glue            = require('glue'),
    _               = require('lodash-node');

//Application plugins
var Users           = require('./routes/users');

//Plugin configurations
var swaggerOptions = {
    apiVersion: Pack.version
};

var yarOptions = {
    storeBlank: false,
    cookieOptions: {
        password: process.env.NODE_YAR_PASSWORD,
        isSecure: process.env.NODE_ENV !== 'development'
    }
};

var goodOptions = {
    opsInterval: 1000,
    reporters: [{
        reporter: require('good-console'),
        events: { log: '*', response: '*' }
    }, {
        reporter: require('good-file'),
        events: { ops: '*' },
        config: './test/fixtures/awesome_log'
    }, {
        reporter: 'good-http',
        events: { error: '*' },
        config: {
            endpoint: 'http://localhost:3000',
            wreck: {
                headers: { 'x-api-key' : 12345 }
            }
        }
    }]
};

var tvOptions = {
    endpoint : '/tv'
};

var chairoUserServiceOptions = {
    seneca : {
    },
    plugin : {
        decorateWithName : 'userService'
    }
};

var chairoProductServiceOptions = {
    seneca : {
    },
    plugin : {
        decorateWithName : 'productService'
    }
};


var pluginConf = [
    {
        './plugins/seneca-plugin' : chairoUserServiceOptions
    },
    {
        './plugins/seneca-plugin' : chairoProductServiceOptions
    },
    {
        './plugins/access-token-auth' : null
    },
    {
        'inert' : null
    },
    {
        'vision' : null
    },
    {
        'hapi-swagger' : swaggerOptions
    },
    {
        'yar' : yarOptions
    },
    {
        'good' : goodOptions
    },
    {
        'tv' : tvOptions
    },
    {
        './routes/users' : null
    }
];

var options = {
    relativeTo: __dirname
};

var manifest = {
    server : {

    },
    connections : [
        {
            port : 3000,
            labels : ['api']
        }
    ],
    plugins : pluginConf
};

Glue.compose(manifest, options, function (err, server) {

    if (err) {
        throw err;
    }
    server.start(function () {

        // Create Seneca client
        server.seneca.client();

        // Add any server.route() config here
        console.log('Server running at:', server.info.uri);
    });
});

