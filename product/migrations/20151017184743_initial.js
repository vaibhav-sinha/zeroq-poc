
exports.up = function(knex, Promise) {
    return Promise.all([

        knex.schema.createTable('products', function(table) {
            table.string('id').primary();
            table.string('name');
            table.double('price');
            table.integer('store_id').unsigned();
            table.boolean('active');
            table.timestamps();
        })
            .then(function(table) {
                console.log("Table products created");
            })
            .catch(function(error) {
                console.log(error);
            })
    ]);
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.dropTableIfExists('products')]);
};
