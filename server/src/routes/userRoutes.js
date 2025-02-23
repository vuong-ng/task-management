const { verifyUser } = require("../middleware/verifyUser.js");
const userServices = require("../services/userServices.js");

module.exports = function (app) {
    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Headers", "Authorization", "Origin, Content-Type, Accept");
        next();
    });

    // user register
    app.post("/api/v1/register", verifyUser.checkExisitingUsername, [verifyUser.checkExistingEmail], userServices.signup);

    // user login 
    app.post("/api/v1/login", userServices.signin);
    
}