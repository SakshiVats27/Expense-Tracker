const express = require('express');
const { 
  loginController, 
  logoutController, 
  signupController, 
  refreshTokenController
} = require('../controller/userController');
const router = express.Router();

router.post('/login', loginController);
router.get('/logout', logoutController);
router.post('/signup', signupController);

// Token Refresh Route
router.post('/refresh-token', refreshTokenController);

module.exports = router;