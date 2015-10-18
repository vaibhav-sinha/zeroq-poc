
exports.up = function(knex, Promise) {
    return Promise.all([

        knex.schema.createTable('carts', function(table) {
            table.increments('id').primary();
            table.string('name');
            table.integer('store_id').unsigned();
            table.boolean('active');
            table.timestamps();
        })
            .then(function(table) {
                console.log("Table carts created");
            })
            .catch(function(error) {
                console.log(error);
            })
    ]);
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.dropTableIfExists('carts')]);
};
