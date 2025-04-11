require('dotenv').config();
const knex = require('knex');

const db = knex({
    client: 'oracledb',
    connection: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    },
    useNullAsDefault: true,
    pool: {
        min: 1,
        max: 3,
        afterCreate: (conn, done) => {
            conn.execute('SELECT SYSDATE FROM DUAL', [], (err, result) => {
                if (err) {
                    console.log('Error al conectar a la base de datos');
                    done(err, conn);
                } else {
                    console.log('Conectado a la base de datos');
                    done(null, conn);
                }
            });
        }
    }
});

module.exports = db;