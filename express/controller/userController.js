const jwt = require('jsonwebtoken');
require('dotenv').config();
const { promisePool: sql } = require('../utils/db');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const moment = require('moment');

module.exports.register = async (req, res, next) => {
  const validateResult = validationResult(req);
  if (!validateResult.isEmpty()) {
    return res.error('註冊表單資料格式不正確');
  }
  try {
    const { name, password, email, avatar } = req.body;
    const [users] = await sql.execute(
      'select * from users where  user_name=?',
      [name]
    );
    if (users.length > 0) {
      return res.error('已經註冊過了');
    }
    await sql.execute(
      'INSERT INTO users (user_name, user_password,user_email,user_avatar) VALUES(?,?,?,?)',
      [name, await bcrypt.hash(password, 10), email, avatar]
    );
    res.success();
  } catch (error) {
    next(error);
  }
};

module.exports.login = async (req, res, next) => {
  const validateResult = validationResult(req);
  if (!validateResult.isEmpty()) {
    return res.error('登入表單格式不正確');
  }
  try {
    const { name, password } = req.body;
    const [users] = await sql.execute('select * from users where user_name=?', [
      name,
    ]);
    if (users.length === 0) {
      return res.error('查無此帳號');
    }
    const result = await bcrypt.compare(password, users[0].user_password);
    if (!result) {
      return res.error('密碼錯誤');
    }
    const token = jwt.sign(
      {
        user_id: users[0].id,
        name,
        password,
        time: moment().format('YYYY/MM/DD HH:mm:ss'),
      },
      process.env.TOKEN_SECRET
    );
    res.data({ user: users[0], token }).send();
  } catch (error) {
    next(error);
  }
};
module.exports.lineLogin = async (req, res, next) => {
  const { name, picture } = req.body;
  try {
    let user_id = '';
    const [users] = await sql.execute('select * from users where user_name=?', [
      name,
    ]);
    if (users.length === 0) {
      const [result] = await sql.execute(
        'INSERT INTO users (user_name,user_avatar) VALUES(?,?)',
        [name, picture]
      );
      console.log(result);
      user_id = result.insertId;
    } else {
      user_id = users[0].id;
    }
    const token = jwt.sign(
      {
        user_id,
        name,
        time: moment().format('YYYY/MM/DD HH:mm:ss'),
      },
      process.env.TOKEN_SECRET
    );
    res.data({ token }).send();
  } catch (error) {
    next(error);
  }
};
module.exports.getUserInfo = async (req, res, next) => {
  try {
    const { name } = req.user;
    const [users] = await sql.execute(
      'select id,user_name,user_email,user_avatar from users where  user_name=?',
      [name]
    );
    if (users.length === 0) {
      return res.error('查無此帳號');
    }
    return res.data(users[0]).send();
  } catch (err) {
    next(err);
  }
};
