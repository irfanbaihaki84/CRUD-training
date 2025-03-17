const express = require('express');
const UsersController = require('../controller/UsersController');

const router = express.Router();

// READ ALL USERS
router.get('/', UsersController.getAllUsers);
// GET ONE USER
router.get('/:idUser', UsersController.getOneUser);
// CREATE
router.post('/', UsersController.createNewUser);
// PATCH - UPDATE
router.patch('/:idUser', UsersController.patchUser);
// PATCH - ISACTIVE
router.patch('/fake/:idUser', UsersController.isactiveUpdate);
// DELETE
router.delete('/:idUser', UsersController.deleteUser);

module.exports = router;
