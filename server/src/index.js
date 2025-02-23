const express = require('express');
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const bcrypt = require('bcrypt');
const pool = require('./config/db');
const createDataTables = require('./data/createDataTables.js');

dotenv.config({
    "path": "../.env",
});

// Middleware
const app = express();
app.use(express.json()); // help handle the requests that send JSON data from the client to the server
app.use(express.urlencoded({ extended: true })) // used to parse incoming request with urlencoded format.
app.use(cors());
app.use(morgan("dev"));

const PORT = process.env.PORT;
// Test Postgres connection
app.get('/', async (req, res) => {
    const result = await pool.query("SELECT current_database()");
    console.log("end");
    res.send(`Database name is: ${result.rows[0].current_database}`);
});

    // create data tables
(async () => {
    try {
        await createDataTables();
        console.log("Database tables created successfully");
    } catch (error) {
        console.error("Error initializing database tables: ", error);
    }
})();

// ROUTES:
require('./routes/taskRoutes.js')(app);
require('./routes/userRoutes.js')(app)

// server run
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})