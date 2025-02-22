import pool from "../config/db";

const createDataTables = async () => {
    const userQuery = `
    CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    hashed_password TEXT NOT NULL, 
    created_at TIMESTAMP DEFAULT NOW()
)
    `;

    const taskQuery = `
    CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    user_id int FOREIGN KEY REFERENCES users(id),
    name VARCHAR(200) NOT NULL,
    description TEXT, 
    created_at TIMESTAMP DEFAULT NOW()
)
    `;

    try {
        await pool.query(userQuery);
        console.log("User table created if not exists");
    } catch (error) {
        console.log("Error creating users table : ", error);
    }

    try {
        await pool.query(taskQuery);
        console.log("tasks table created if not exists");
    } catch (error) {
        console.log("Error creating tasks table : ", error);
    }
};

export default createDataTables;