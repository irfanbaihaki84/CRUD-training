const express = require('express');
const UsersController = require('../controller/UsersController');

const router = express.Router();

// READ ALL USERS
router.get('/', UsersController.getAllUsers);

module.exports = router;
