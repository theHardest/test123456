const express = require('express');
const router = express.Router();
const userRouter = require('./user');
const cusRouter = require('./cus');
const labelRouter = require('./label');
const tokenMiddleware = require('../middleware/tokenMiddleware');

router.use('/user', userRouter);
router.use('/cus', tokenMiddleware, cusRouter);
router.use('/label', tokenMiddleware, labelRouter);

module.exports = router;
