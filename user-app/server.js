var Hapi            = require('hapi'),
    Pack            = require('./package'),
    Glue            = require('glue'),
    Path            = require('path'),
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
    reporters: [
        {
            reporter: require('good-console'),
            events: { log: '*', response: '*' }
        },
        {
            reporter: require('good-file'),
            events: { ops: '*' },
            config: './logs/user-app.log'
        },
        {
            reporter: 'good-http',
            events: { error: '*' },
            config: {
                endpoint: 'http://localhost:6000',
                wreck: {
                    headers: { 'x-api-key' : 12345 }
                }
            }
        }
    ]
};

var tvOptions = {
    endpoint : '/tv'
};

var senecaUserServiceOptions = {
    seneca : {
    },
    plugin : {
        decorateWithName : 'userService'
    }
};

var senecaProductServiceOptions = {
    seneca : {
    },
    plugin : {
        decorateWithName : 'productService'
    }
};

var senecaShoppingServiceOptions = {
    seneca : {
    },
    plugin : {
        decorateWithName : 'shoppingService'
    }
};


var pluginConf = [
    {
        './plugins/seneca-plugin' : senecaUserServiceOptions
    },
    {
        './plugins/seneca-plugin' : senecaProductServiceOptions
    },
    {
        './plugins/seneca-plugin' : senecaShoppingServiceOptions
    },
    {
        './plugins/access-token-auth' : null
    },
    {
        './plugins/socket' : null
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
        './routes/users' : [{
            routes: { prefix: '/user' }
        }]
    },
    {
        './routes/shopping' : [{
            routes: { prefix: '/shopping' }
        }]
    }
];

var options = {
    relativeTo: __dirname
};

var manifest = {
    server : {
        connections: {
            routes: {
                files: {
                    relativeTo: Path.join(__dirname, 'static')
                }
            }
        }
    },
    connections : [
        {
            host : '0.0.0.0',
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
        server.userService.client({port : 20101});
        server.productService.client({port : 20102});
        server.shoppingService.client({port : 20103});

        //Server static content
        server.route({
            method: 'GET',
            path: '/{param}',
            handler: {
                directory: {
                    path: [
                        './html',
                        './css',
                        './js'
                    ]
                }
            }
        });

        // Add any server.route() config here
        console.log('Server running at:', server.info.uri);
    });
});


