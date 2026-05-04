const express = require('express');
const { 
  loginController, 
  logoutController, 
  signupController, 
  refreshTokenController,
  forgotPasswordController,
  resetPasswordController
} = require('../controller/userController');
const router = express.Router();

router.post('/login', loginController);
router.get('/logout', logoutController);
router.post('/signup', signupController);
router.post('/forgot-password', forgotPasswordController);
router.post('/reset-password/:token', resetPasswordController);

// Token Refresh Route
router.post('/refresh-token', refreshTokenController);

module.exports = router;
