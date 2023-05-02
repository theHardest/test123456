const jwt = require('jsonwebtoken');
require('../utils/env');

const getTokenFromHeader = (req) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1] || '';

    return token;
  } catch (error) {
    return '';
  }
};

const verifyToken = async (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
      if (err) {
        reject({
          status: 'error',
          message: 'Token 驗證失敗。請重新登入。',
        });
      } else {
        resolve(decoded);
      }
    });
  });
};

const tokenMiddleware = async (req, res, next) => {
  const token = getTokenFromHeader(req);
  try {
    const decoded = await verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json(error);
  }
};

module.exports = tokenMiddleware;
