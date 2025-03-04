const pool = require("../config/db.js");

const createDataTables = async () => {
    const userQuery = `
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password TEXT NOT NULL
)`;

    const taskQuery = `
    CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        user_id INT,
        name VARCHAR(200) NOT NULL,
        description TEXT,
        isComplete BOOLEAN NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        FOREIGN KEY (user_id) REFERENCES users(id)
)`;

    try {
        await pool.query(userQuery);
        console.log("User table created if not exists");
    } catch (error) {
        console.log("Error creating users table : ", error.message);
    }

    try {
        await pool.query(taskQuery);
        console.log("tasks table created if not exists");
    } catch (error) {
        console.log("Error creating tasks table : ", error.message);
    }
};

module.exports = createDataTables;