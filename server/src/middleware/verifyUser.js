const database = require("../config/db");

const checkExisitingUsername = async (req, res, next) => {
    const username = req.body.name;
    const existingUsername = await database.query("SELECT * FROM users WHERE name = $1", [username]);
    if (existingUsername.rowCount > 0) {
        res.status(400).send({
            message: "Username already used"
        });
        return;
    }
    next();
};

const checkExistingEmail = async (req, res, next) => {
    const email = req.body.name;
    const existingEmail = await database.query("SELECT * FROM users WHERE email = $1", [email]);
    if (existingEmail.rowCount > 0) {
        res.status(400).sned({
            message: "Email already used"
        })
        return;
    }
    next();
}

const verifyUser = {
    checkExisitingUsername: checkExisitingUsername,
    checkExistingEmail: checkExistingEmail,
}

module.exports = {verifyUser};