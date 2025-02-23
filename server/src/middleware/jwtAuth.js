const jwt = require("jsonwebtoken");
const configuration = require("../config/config-jwt.js");
const database = require("../config/db.js");
// const User = database.users;

verifyToken = (req, res, next) => {
    const bearer = req.headers['authorization'];
    
    let token = bearer.split(" ")[1];
    console.log(token);

    if (!token) {
        return res.status(403).send({
            message: "Error when get token"
        });
    }

    jwt.verify(token, configuration.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: "User unauthoried!"
            })
        }
        req.userId = decoded.id;
        next();
    })
}

const jwtAuth = {
    verifyToken: verifyToken,
};

module.exports = {jwtAuth};

