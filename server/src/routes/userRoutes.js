const { verifyUser } = require("../middleware");
const userServices = require("../services");

module.exports = function (app) {
    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Headers", "Authorization", "Origin, Content-Type, Accept");
        next();
    });

    // user register
    app.post("/api/v1/register", [verifyUser.checkExistingUsername], [verifyUser.checkExistingEmail], userServices.register);

    // user login 
    app.post("/api/v1/login", userServices.login);
    
}