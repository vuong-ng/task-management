SELECT 'CREATE DATABASE tasksmanagement' 
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname='tasksmanagement')\gexec

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    hashed_password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
)