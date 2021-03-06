module.exports = {
    development: {
        client: 'mysql',
        connection: {
            host: '127.0.0.1',
            user: 'root',
            password: 'iloveanna',
            database: 'zeroq_billing',
            charset: 'utf8'
        },
        debug: true,
        migrations: {
            tableName: 'migrations',
            directory: 'migrations'
        },
        seeds: {
            directory: 'seeds'
        },
        pool: {
            max: 10
        }
    }
};
