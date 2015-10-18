var db = require('./db');

var Product = db.Model.extend({
    tableName : 'products',
    hasTimestamps : true
});

var Cart = db.Model.extend({
    tableName : 'carts',
    hasTimestamps : true
});

var Tag = db.Model.extend({
    tableName : 'tags',
    hasTimestamps : true
});

var TagStoreProductMapping = db.Model.extend({
    tableName : 'tag_store_product_mapping',
    hasTimestamps : true
});


module.exports = {
    Product : Product,
    Cart : Cart,
    Tag : Tag,
    TagStoreProductMapping : TagStoreProductMapping
};