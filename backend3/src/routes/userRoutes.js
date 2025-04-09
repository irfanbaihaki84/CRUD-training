const express = require('express');
const { authenticate, authorize } = require('../middleware/authenticate');
const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  updatePassword,
  deleteUser,
  // searchUsers,
  getAllUsers1,
} = require('../controllers/userControllers');

const router = express.Router();

// router.post('/', authenticate, authorize(['admin']), createUser);
router.post('/', authenticate, createUser);
router.get('/', authenticate, getAllUsers);
router.get('/:id', authenticate, getUserById);
router.patch('/:id', authenticate, updateUser);
router.patch('/:id/password', authenticate, updatePassword);
router.delete('/:id', authenticate, authorize(['admin']), deleteUser);
// router.get('/search', authenticate, authorize(['admin']), searchUsers);
router.get('/search', authenticate, getAllUsers1);

module.exports = router;
