const db = require("../config/db.js");

const validateRequest = (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "Request can't be empty"
        })
        return false;
    }
    return true;
}

// add new task
exports.create = async (req, res) => {
    const {userid} = req.params;
    console.log("Request:", req.body, userid)
    if (!validateRequest(req, res)) return;

    try {
        const newTask = await db.query("INSERT INTO tasks (user_id, name, description, isComplete) VALUES ( $1, $2, $3, $4) RETURNING *" , [userid, req.body.name, req.body.description, req.body.complete]);
        res.json(newTask.rows);
    } catch (error) {
        console.log(error.message);
    }
}

// find all tasks of a user
exports.findAll = async (req, res) => {
    const { userid } = req.params;
    console.log("Request : ", req.body);
    if(!validateRequest(req,res)) return;

    try {
        const tasksList = await db.query("SELECT * FROM tasks WHERE user_id = $1", [userid]);
        res.json(tasksList.rows)

    } catch (error){
        console.log(error.message);
    }
}

// find task by task id
exports.findOne = async (req, res) => {
    const { userid, taskid } = req.params;
    console.log("Request: ", req.body);
    if(!validateRequest(req,res)) return;

    try {
        const task = await db.query("SELECT * FROM tasks WHERE user_id = $1 AND id=$2", [userid, taskid]);
        res.json(task.rows[0]);
        console.log(task.rows[0]);
    } catch (error) {
        console.log(error.message);
    }
}

// update task with task id
exports.update = async (req, res) => {
    const { userid, taskid } = req.params;
    console.log("Request: ", req.body);
    if(!validateRequest(req,res)) return;

    try {
        const updateTask = await db.query("UPDATE tasks SET name = $1 , description = $2, isComplete=$3 WHERE user_id=$4 AND id=$5 RETURNING *", [req.body.name, req.body.description, req.body.complete, userid, taskid])
        res.json(updateTask.rows[0]);
    } catch (error) {
        console.log(error.message);
    }

}

// delete task with task id
exports.delete = async (req, res) => {
    const { userid, taskid } = req.params;
    console.log("Request: ", req.body);
    if(!validateRequest(req,res)) return;

    try {
        const deleteTask = await db.query("DELETE FROM tasks WHERE user_id = $1 AND id = $2 RETURNING *", [userid, taskid]);
        res.json(deleteTask);
    } catch (error) {
        console.log(error.message);
    }

}
