var Seneca = require('seneca')();

Seneca.use('./services/product_service');
Seneca.use('./services/cart_service');
Seneca.use('./services/tag_service');
Seneca.listen({port : 20102});