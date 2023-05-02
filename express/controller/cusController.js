require('dotenv').config();
const { promisePool: sql, withTransaction } = require('../utils/db');
const moment = require('moment');

module.exports.index = async (req, res, next) => {
  // 定義轉換函式
  function transformData(data) {
    const customers = new Map();
    for (const item of data) {
      // 尋找 customers 中是否已經存在該客戶
      let customer = customers.get(item.id);
      // 如果不存在，則新增一筆客戶資料
      if (!customer) {
        customer = {
          id: item.id,
          cus_name: item.cus_name,
          cus_number: item.cus_number,
          cus_email: item.cus_email,
          cus_idnumber: item.cus_idnumber,
          cus_remark: item.cus_remark,
          cus_status: item.cus_status,
          cus_level: item.cus_level,
          label_names: [],
        };
        customers.set(item.id, customer);
      }
      // 如果該筆資料有標籤，則加入該客戶的標籤
      if (item.label_id && item.label_name) {
        customer.label_names.push({
          id: item.label_id,
          label_name: item.label_name,
        });
      }
    }
    return [...customers.values()];
  }
  try {
    const [result] = await sql.execute(
      `SELECT a.id,cus_name,cus_number,cus_email,cus_idnumber,cus_remark,cus_status,cus_level,c.id AS 'label_id',c.label_name
FROM cus_profile a 
left join cus_profile_label b 
on a.id=b.cus_id 
left join labels c on b.label_id=c.id 
`
    );
    const data = transformData(result);
    return res.data(data).send();
  } catch (err) {
    next(err);
  }
};
module.exports.index2 = async (req, res, next) => {
  const page = req.query.page || req.body.page || 1;
  const size = req.query.size || req.body.size;
  // 定義轉換函式
  function transformData(data) {
    const customers = new Map();
    for (const item of data) {
      // 尋找 customers 中是否已經存在該客戶
      let customer = customers.get(item.id);
      // 如果不存在，則新增一筆客戶資料
      if (!customer) {
        customer = {
          id: item.id,
          cus_name: item.cus_name,
          cus_number: item.cus_number,
          cus_email: item.cus_email,
          cus_idnumber: item.cus_idnumber,
          cus_remark: item.cus_remark,
          cus_status: item.cus_status,
          cus_level: item.cus_level,
          label_names: [],
        };
        customers.set(item.id, customer);
      }
      // 如果該筆資料有標籤，則加入該客戶的標籤
      if (item.label_id && item.label_name) {
        customer.label_names.push({
          id: item.label_id,
          label_name: item.label_name,
        });
      }
    }
    return [...customers.values()];
  }
  try {
    const [queryCount] = await sql.execute(
      `SELECT count(*) as 'total' FROM cus_profile`
    );
    const total = queryCount[0].total;
    const limit = size ? size : total;
    const offset = (page - 1) * size || 0;
    const [result] = await sql.execute(
      `SELECT a.id,cus_name,cus_number,cus_email,cus_idnumber,cus_remark,cus_status,cus_level,c.id AS 'label_id',c.label_name
FROM cus_profile a 
left join cus_profile_label b 
on a.id=b.cus_id 
left join labels c on b.label_id=c.id 
limit ?
offset ?
`,
      [limit, offset]
    );
    const data = transformData(result);
    return res.data(data).add('total', total).send();
  } catch (err) {
    next(err);
  }
};

module.exports.create = async (req, res, next) => {
  const {
    // user_id,
    cus_name,
    cus_number,
    cus_email,
    cus_idnumber,
    cus_remark,
    cus_status,
    cus_level,
  } = req.body;
  try {
    await sql.execute(
      'INSERT INTO cus_profile (create_user_id,cus_name,cus_number,cus_email,cus_idnumber,cus_remark,cus_status,cus_level) VALUES(?,?,?,?,?,?,?,?)',
      [
        req.user.user_id,
        cus_name,
        cus_number,
        cus_email,
        cus_idnumber,
        cus_remark,
        cus_status,
        cus_level,
      ]
    );
    return res.message('新增成功').send();
  } catch (err) {
    next(err);
  }
};

//修改第二版
module.exports.edit = async (req, res, next) => {
  const data = req.body;
  const { id } = req.params;
  const { label_names } = data;
  // 更新使用者資料
  const updateUserData = async (id, sqlString, sql) => {
    await sql.execute(`UPDATE cus_profile SET ${sqlString} WHERE id = ?`, [id]);
  };
  // 將資料轉換為 SQL 字串
  const getSqlString = (data, userId) => {
    const excludedKeys = ['label_names', 'cus_id', 'user_id', 'id'];
    const columns = Object.entries(data)
      .filter(([key]) => !excludedKeys.includes(key))
      .map(([key, value]) => {
        const column = key;
        const valueString = typeof value === 'string' ? `'${value}'` : value;
        return `${column}=${valueString}`;
      });
    const sqlString = `edit_user_id=${userId}, update_time='${moment().format(
      'YYYY-MM-DD HH:mm:ss'
    )}', ${columns.join(', ')}`;
    return sqlString;
  };
  // 取得使用者標籤
  const getLabels = async (id, sql) => {
    const [result] = await sql.execute(
      'SELECT label_id as "id" from cus_profile_label WHERE cus_id = ?;',
      [id]
    );
    return result;
  };
  // 新增標籤
  const addLabels = async (id, labelNames, labels, sql) => {
    if (labelNames && labelNames.length !== 0) {
      const labelIdsToAdd = labelNames.filter(
        (label) => !labels.some((item) => item.id === label.id)
      );
      const addLabelQueries = labelIdsToAdd.map((label) =>
        sql.execute(
          'INSERT INTO cus_profile_label (cus_id,label_id) VALUES(?,?)',
          [id, label.id]
        )
      );
      await Promise.all(addLabelQueries);
    }
  };
  // 刪除標籤
  const deleteLabels = async (id, labelNames, labels, sql) => {
    const labelIdsToDelete = labels.filter(
      (label) => !labelNames.some((item) => item.id === label.id)
    );
    const deleteLabelQueries = labelIdsToDelete.map((label) =>
      sql.execute(
        'DELETE FROM cus_profile_label WHERE label_id=? AND cus_id=?',
        [label.id, id]
      )
    );
    await Promise.all(deleteLabelQueries);
  };

  // 將資料轉換為 SQL 字串
  const sqlString = getSqlString(data, req.user.user_id);
  try {
    await withTransaction(async (sql) => {
      // 取得使用者標籤
      const labels = await getLabels(id, sql);
      // 新增標籤
      await addLabels(id, label_names, labels, sql);
      // 刪除標籤
      await deleteLabels(id, label_names, labels, sql);
      // 更新使用者資料
      await updateUserData(id, sqlString, sql);
    });
    return res.message('成功修改').send();
  } catch (err) {
    next(err);
  }

  // let connection;
  // try {
  //   connection = await sql.getConnection();
  //   await connection.beginTransaction();
  //   // 取得使用者標籤
  //   const labels = await getLabels(id, connection);
  //   // 新增標籤
  //   await addLabels(id, label_names, labels, connection);
  //   // 刪除標籤
  //   await deleteLabels(id, label_names, labels, connection);
  //   // 更新使用者資料
  //   await updateUserData(id, sqlString, connection);
  //   await connection.commit();
  //   return res.message('成功修改').send();
  // } catch (err) {
  //   await connection.rollback();
  //   next(err);
  // } finally {
  //   if (connection) connection.release();
  // }
};

module.exports.destroy = async (req, res, next) => {
  const cus_id = req.params.id;
  try {
    await sql.execute('DELETE FROM cus_profile WHERE id=?', [cus_id]);
    await sql.execute('DELETE FROM cus_profile_label WHERE cus_id=?', [cus_id]);
    return res.message('成功刪除').send();
  } catch (err) {
    next(err);
  }
};
