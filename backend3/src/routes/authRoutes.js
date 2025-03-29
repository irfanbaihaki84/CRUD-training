const express = require('express');

const {
  signup,
  signin,
  signout,
  forgotPassword,
} = require('../controllers/authControllers');

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/signout', signout);
router.post('/forgot-password', forgotPassword);

module.exports = router;
