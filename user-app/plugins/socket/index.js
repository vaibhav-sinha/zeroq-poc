var Handlers = require('./handlers');

exports.register = function (server, options, next) {

    var io = require('socket.io')(server.listener);
    server.decorate('server', 'socket', io);

    /*io.on('connection', function (socket) {

        console.log('New connection!');

        socket.on('hello', Handlers.hello);
        socket.on('newMessage', Handlers.newMessage);
        socket.on('goodbye', Handlers.goodbye);
    });*/

    next();
};

exports.register.attributes = {
    name: 'socket'
};