const express = require('express');
const router = express.Router();
const {signUp,login,getAllDataOfUser} = require('../controllers/userController');

router.route("/signup").post(signUp);
router.route("/login").post(login);
router.route("/users/:userId/lists-with-tasks").get(getAllDataOfUser);
module.exports = router; 