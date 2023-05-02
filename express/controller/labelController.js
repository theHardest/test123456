require('dotenv').config();
const { promisePool: sql } = require('../utils/db');

module.exports.index = async (req, res, next) => {
  try {
    const [result] = await sql.execute('select id,label_name from labels');
    return res.json({ status: 'success', data: result });
  } catch (err) {
    next(err);
  }
};

module.exports.create = async (req, res, next) => {
  try {
    const { label_name } = req.body;
    if (!label_name) {
      return res.error('標籤不能為空');
    }
    const [result] = await sql.execute(
      'select * from labels where label_name = ?',
      [label_name]
    );
    if (result.length !== 0) {
      return res.error('標籤重複');
    }
    await sql.execute('INSERT INTO labels (label_name) VALUES(?)', [
      label_name,
    ]);
    return res.message('新增成功').send();
  } catch (err) {
    next(err);
  }
};
module.exports.destroy = async (req, res, next) => {
  try {
    await sql.execute('DELETE FROM labels WHERE id=?', [req.body.label_id]);
    return res.success('刪除成功');
  } catch (err) {
    next(err);
  }
};
