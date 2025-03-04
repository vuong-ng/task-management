const db = require("../config/db");
const configuration = require("../config/config-jwt.js");

const validateRequest = (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "Request can't be empty"
        })
        return false;
    }
    return true;
}

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
    if (!req.body) {
        res.status(400).send({ message: "Email and password are required!" });
        return;
    }
    console.log("request: ", req.body);
    if(!validateRequest(req,res)) return;
    try {
            const query = "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *";
            const values = [req.body.name, req.body.email, bcrypt.hashSync(req.body.password, 8)];
            const result = await db.query(query, values);
            const newUser = result.rows[0];
            res.json(newUser);
            console.log(newUser);
        } catch (error) {
            console.log(error.message);
            }
}

exports.signin = async (req, res) => {

    const username = req.body.name;
    console.log(username);
    if(!validateRequest(req,res)) return;
    try {
        const result = await db.query("SELECT * FROM users WHERE name = $1", [username]);
        const user = result.rows[0];
        console.log("sign in",user);
        var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid) {
            return res.status(401).send({
                accessToken: null,
                message: "Invalid password!",
            });
        }

        //  set expried token in 10 minutes
        var token = jwt.sign({ id: user.id }, configuration.secret, {
            expiresIn: 8600,
        });
        res.status(200).send({
                id: user.id,
                name: user.name,
                email: user.email,
                accessToken:token,
        })
        
    } catch (error) {
        console.log(error.message);
        return;
    }
    
}

