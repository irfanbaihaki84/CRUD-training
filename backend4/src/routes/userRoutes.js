const express = require('express');
const router = express.Router();
const userController = require('../controllers/userControllers');
const { authenticate, authorize } = require('../middleware/authenticate');

router.get('/', authenticate, authorize, userController.getAllUsers);
router.get('/:id', authenticate, authorize, userController.getUserById);
router.post('/', authenticate, authorize, userController.createUser);
router.patch('/:id', authenticate, authorize, userController.updateUser);
router.patch(
  '/updatePass/:id',
  authenticate,
  authorize,
  userController.updatePassword
);
router.patch('/:id', authenticate, authorize, userController.deleteUser);
// Add other user routes with proper authentication/authorization

module.exports = router;
