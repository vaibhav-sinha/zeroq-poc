var Seneca = require('seneca')();

Seneca.use('./services/product_service');
Seneca.listen({port : 20102});