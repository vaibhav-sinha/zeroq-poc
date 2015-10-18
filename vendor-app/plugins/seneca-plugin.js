var Seneca = require('seneca');

exports.register = function(server, options, next) {

    options = options || {};
    var senecaOptions = options.seneca || options;
    var pluginOptions = options.plugin || null;

    var seneca = Seneca(senecaOptions);

    server.decorate('server', pluginOptions.decorateWithName || 'seneca', seneca);

    next();
};

exports.register.attributes = {
    name : 'seneca-plugin',
    multiple : true
};