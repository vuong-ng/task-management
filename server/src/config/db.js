const Pool = require('pg').Pool;
const path = require('path');
require('dotenv').config({
    path: path.resolve(__dirname, '../../.env')
});

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: 'localhost',
    port: 5432,
    database: process.env.DB_NAME,
});

pool.on("connect", () => {
    console.log("Connection pool established with Database");
});

module.exports = pool;