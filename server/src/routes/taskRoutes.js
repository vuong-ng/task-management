const { jwtAuth } = require("../middleware");
const taskServices = require("../services/taskServices.js")

module.exports = function (app) {
    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Headers", "Authorization", "Origin, Content-Type, Accept");
        next();
    });
    
    // add a task of a user
    app.post("/api/:userid/addtask", [jwtAuth.verifyToken], taskServices.create);

    // find all tasks of a user
    app.get("/api/:userid/gettasks", [jwtAuth.verifyToken], taskServices.findAll);

    // find task with task id
    app.post("/api/:userid/tasks/:taskid", [jwtAuth.verifyToken], taskServices.findOne);

    // update a task with task id
    app.post("/api/:userid/task/:taskid", [jwtAuth.verifyToken], taskServices.update);

    // delete a task by task id
    app.post("/api/:userid/task/:taskid", [jwtAuth.verifyToken], taskServices.delete);
}