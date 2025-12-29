const mysql = require('mysql2');
require('dotenv').config();

// Create MySQL connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'tmwatch_db',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Get promise-based connection
const promisePool = pool.promise();

// Test database connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Database connection failed:', err.message);
        if (err.code === 'ECONNREFUSED') {
            console.error('   Make sure MySQL is running!');
        } else if (err.code === 'ER_ACCESS_DENIED_ERROR') {
            console.error('   Check your database credentials in .env file');
        } else if (err.code === 'ER_BAD_DB_ERROR') {
            console.error('   Database does not exist. Run schema.sql first!');
        }
    } else {
        console.log('✅ Database connected successfully');
        connection.release();
    }
});

module.exports = promisePool;
