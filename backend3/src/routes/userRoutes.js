const express = require('express');
const { authenticate, authorize } = require('../middleware/authenticate');
const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  updatePassword,
  deleteUser,
} = require('../controllers/userControllers');

const router = express.Router();

// router.post('/', authenticate, authorize(['admin']), createUser);
router.post('/', createUser);
router.get('/', authenticate, getAllUsers);
router.get('/:id', authenticate, getUserById);
router.patch('/:id', authenticate, updateUser);
router.patch('/:id/password', authenticate, updatePassword);
router.delete('/:id', authenticate, authorize(['admin']), deleteUser);

module.exports = router;
