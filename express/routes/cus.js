const express = require('express');
const router = express.Router();
const {
  create,
  edit,
  destroy,
  index,
  index2,
} = require('../controller/cusController');

router.get('/', index);
router.get('/index', index2);
router.post('/', create);
router.patch('/:id', edit);
router.delete('/:id', destroy);

module.exports = router;
