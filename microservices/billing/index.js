var Seneca = require('seneca')();

Seneca.use('./services/shopping_service');
Seneca.listen({port : 20103});