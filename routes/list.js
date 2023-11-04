const express = require('express');
const router = express.Router();
const {createList,removeList} = require('../controllers/listControllers');

router.route("/createList").post(createList);
router.route('/removeList/:listId').delete(removeList);
module.exports = router; 