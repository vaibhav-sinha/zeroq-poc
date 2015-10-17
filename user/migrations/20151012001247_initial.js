
exports.up = function(knex, Promise) {
    return Promise.all([

        knex.schema.createTable('users', function(table) {
            table.string('id').primary();
            table.string('name');
            table.string('address');
            table.string('gender');
            table.string('key');
            table.timestamps();
        })
            .then(function(table) {
                console.log("Table users created");
            })
            .catch(function(error) {
                console.log(error);
            }),

        knex.schema.createTable('vendors', function(table) {
            table.increments('id').primary();
            table.string('name');
            table.string('industry');
            table.string('username');
            table.string('password');
            table.string('salt');
            table.timestamps();
        })
            .then(function(table) {
                console.log("Table vendors created");
            })
            .catch(function(error) {
                console.log(error);
            }),

        knex.schema.createTable('stores', function(table) {
            table.increments('id').primary();
            table.string('name');
            table.string('location');
            table.string('phone');
            table.string('username');
            table.string('password');
            table.string('salt');
            table.integer('vendor_id').unsigned().references('vendors.id');
            table.timestamps();
        })
            .then(function(table) {
                console.log("Table stores created");
            })
            .catch(function(error) {
                console.log(error);
            })
    ]);
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.dropTableIfExists('users'),
        knex.schema.dropTableIfExists('vendors'),
        knex.schema.dropTableIfExists('stores')]);
};
