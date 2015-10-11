var bookshelf;
configure_db();
module.exports = bookshelf;

function configure_db() {
    var dbConfig = require('./knexfile');
    var knex = require('knex')(dbConfig.development);

    bookshelf = require('bookshelf')(knex);
}

