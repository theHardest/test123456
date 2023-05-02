const { body } = require('express-validator');

const registerRules = [
  body('name').not().isEmpty().trim().escape(),
  body('password').isLength({ min: 6 }),
  body('confirmPassword').custom((value, { req }) => {
    return value === req.body.password;
  }),
];
const loginRules = [
  body('name').not().isEmpty().trim().escape(),
  body('password').isLength({ min: 6 }),
];

module.exports = { registerRules, loginRules };
