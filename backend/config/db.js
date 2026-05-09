const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Testimi i lidhjes
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Gabim ne lidhjen me databazen:', err.message);
    } else {
        console.log('Lidhja me databazen u realizua me sukses!');
        connection.release();
    }
});

module.exports = pool.promise();