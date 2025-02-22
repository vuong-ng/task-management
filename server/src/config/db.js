const Pool = require('pg').Pool;
require('dotenv').config({
    "path": "../.env"
});

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: 'localhost',
    port: 5432,
    database: process.env.DB_NAME,
});

pool.on("connect", () => {
    console.log("Connectoin pool established with Database");
});

module.exports = pool;