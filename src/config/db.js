const mysql = require('mysql2/promise');


// Database configuration
const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '1234',
    database: 'sahaai_db',
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10
});

module.exports = pool;