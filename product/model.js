var db = require('./db');

var Product = db.Model.extend({
    tableName : 'products',
    hasTimestamps : true
});


module.exports = {
    Product : Product
};