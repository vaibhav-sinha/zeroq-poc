var Hapi            = require('hapi'),
    Inert           = require('inert'),
    Vision          = require('vision'),
    HapiSwagger     = require('hapi-swagger'),
    Pack            = require('./package'),
    Good            = require('good'),
    Tv              = require('tv'),
    Yar             = require('yar'),
    Chairo          = require('chairo'),
    _               = require('lodash-node');

var server = new Hapi.Server();
server.connection({ port: 3000 });

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

var pluginConf = [
    {
        register : Inert
    },
    {
        register : Vision
    },
    {
        register: HapiSwagger,
        options: swaggerOptions
    },
    {
        register : Yar,
        options : yarOptions
    },
    {
        register : Good,
        options : goodOptions
    },
    {
        register : Tv,
        options : tvOptions
    },
    {
        register : Chairo
    }
];

server.register(pluginConf, function (err) {
    server.start(function() {

        // Create Seneca client
        server.seneca.client();

        // Add any server.route() config here
        console.log('Server running at:', server.info.uri);

        //Test seneca
        server.seneca.act( 'role:user, cmd:get_by_id, id:1', console.log );
    });
});