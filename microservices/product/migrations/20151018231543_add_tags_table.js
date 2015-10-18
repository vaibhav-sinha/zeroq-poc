
exports.up = function(knex, Promise) {
    return Promise.all([

        knex.schema.createTable('tags', function(table) {
            table.increments('id').primary();
            table.integer('manufacturer_id').unsigned();
            table.string('status');
            table.timestamps();
        })
            .then(function(table) {
                console.log("Table tags created");
            })
            .catch(function(error) {
                console.log(error);
            }),

        knex.schema.createTable('tag_store_product_mapping', function(table) {
            table.increments('id').primary();
            table.integer('tag_id').unsigned();
            table.integer('store_id').unsigned();
            table.integer('product_id').unsigned();
            table.timestamps();
        })
            .then(function(table) {
                console.log("Table tag_store_product_mapping created");
            })
            .catch(function(error) {
                console.log(error);
            })
    ]);
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.dropTableIfExists('tags'),
        knex.schema.dropTableIfExists('tag_store_product_mapping')
    ]);
};
