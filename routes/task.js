const express = require('express');
const router = express.Router();
const {createTask,updateTaskState,updateTaskList} = require('../controllers/taskController');

router.route("/users/:userId/lists/:listId/tasks").post(createTask);
router.route("/updateTaskState/:taskId").put(updateTaskState);
router.route("/updateTaskList").put(updateTaskList);



module.exports = router; 