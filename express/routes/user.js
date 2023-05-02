const express = require('express');
const router = express.Router();

const {
  login,
  register,
  getUserInfo,
  lineLogin,
} = require('../controller/userController');
const tokenMiddleware = require('../middleware/tokenMiddleware');
const { registerRules, loginRules } = require('../utils/rules');

router.post('/register', registerRules, register);
router.post('/login', loginRules, login);
router.post('/lineLogin', lineLogin);

router.get('/userinfo', tokenMiddleware, getUserInfo);

module.exports = router;
