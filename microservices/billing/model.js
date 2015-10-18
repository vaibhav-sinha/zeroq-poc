var db = require('./db');

var Shopping = db.Model.extend({
    tableName : 'shopping',
    hasTimestamps : true
});

var ShoppingItems = db.Model.extend({
    tableName : 'shopping_items',
    hasTimestamps : true
});


module.exports = {
    Shopping : Shopping,
    ShoppingItems : ShoppingItems
};