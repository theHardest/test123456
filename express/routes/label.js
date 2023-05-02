const express = require('express');
const router = express.Router();
const { create, destroy, index } = require('../controller/labelController');

router.get('/', index);
router.post('/', create);
router.delete('/delete', destroy);

module.exports = router;
