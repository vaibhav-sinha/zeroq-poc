var db = require('./db');

var User = db.Model.extend({
    tableName : 'users',
    hasTimestamps : true
});

var Vendor = db.Model.extend({
    tableName : 'vendors',
    hasTimestamps : true,
    stores : function() {
        this.hasMany(Store);
    }
});

var Store = db.Model.extend({
    tableName : 'stores',
    hasTimestamps : true,
    vendor : function() {
        this.belongsTo(Vendor);
    }
});

module.exports = {
    User : User,
    Vendor : Vendor,
    Store : Store
};