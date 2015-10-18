var Seneca = require('seneca')();

Seneca.use('./services/user_service');
Seneca.use('./services/vendor_service');
Seneca.listen({port: 20101});