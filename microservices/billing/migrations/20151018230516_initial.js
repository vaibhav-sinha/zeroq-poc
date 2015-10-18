
exports.up = function(knex, Promise) {
    return Promise.all([

        knex.schema.createTable('shopping', function(table) {
            table.increments('id').primary();
            table.string('status');
            table.integer('store_id').unsigned();
            table.integer('user_id').unsigned();
            table.integer('cart_id').unsigned();
            table.timestamps();
        })
            .then(function(table) {
                console.log("Table shopping created");
            })
            .catch(function(error) {
                console.log(error);
            }),

        knex.schema.createTable('shopping_items', function(table) {
            table.increments('id').primary();
            table.boolean('active');
            table.integer('shopping_id').unsigned();
            table.integer('product_id').unsigned();
            table.integer('tag_id').unsigned();
            table.integer('price').unsigned();
            table.timestamps();
        })
            .then(function(table) {
                console.log("Table shopping_items created");
            })
            .catch(function(error) {
                console.log(error);
            })
    ]);
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.dropTableIfExists('shopping'),
        knex.schema.dropTableIfExists('shopping_items')
    ]);
};
