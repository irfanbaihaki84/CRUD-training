const express = require('express');
const userController = require('../controllers/userControllers');

const router = express.Router();

// CRUD Routes
router.post('/', userController.createUser);
router.get('/', userController.getUsers);
router.get('/:id', userController.getOneUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
