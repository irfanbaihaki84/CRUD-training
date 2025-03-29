const express = require('express');
const { authenticate, authorize } = require('../middleware/authenticate');
const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require('../controllers/userControllers');

const router = express.Router();

// router.post('/', authenticate, authorize(['admin']), createUser);
router.post('/', createUser);
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.patch('/:id', authenticate, updateUser);
router.delete('/:id', authenticate, authorize(['admin']), deleteUser);

module.exports = router;
