const { faker } = require('@faker-js/faker');
const mysql = require('mysql2/promise');
const pool = mysql.createPool({
  host: 3306,
  user: 'root',
  password: '',
  database: 'vue_test',
});
const levelOptions = ['銅', '銀', '金', '白金'];
const statusOptions = ['新客戶', '舊客戶', '潛在客戶'];
function getRandomItemFromArray(arr) {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}
function generateTWID() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const firstLetter = letters[Math.floor(Math.random() * letters.length)];
  const secondLetter = Math.floor(Math.random() * 2) + 1;
  let rest = '';

  for (let i = 0; i < 8; i++) {
    rest += Math.floor(Math.random() * 10) + 1;
  }

  return `${firstLetter}${secondLetter}${rest}`;
}
function randomPhone() {
  let phoneNumber = '09';

  for (let i = 0; i < 8; i++) {
    phoneNumber += Math.floor(Math.random() * 10);
  }

  return phoneNumber;
}

function createRandomUser() {
  return {
    id: 1,
    cus_name: faker.internet.userName(),
    cus_number: randomPhone(),
    cus_email: faker.internet.email(),
    cus_idnumber: generateTWID(),
    cus_remark: faker.commerce.product(),
    cus_status: getRandomItemFromArray(statusOptions),
    cus_level: getRandomItemFromArray(levelOptions),
  };
}
async function insertDb(number = 1) {
  console.log(`創建${number}筆資料開始`);
  const sqlString =
    'INSERT INTO cus_profile (create_user_id,cus_name,cus_number,cus_email,cus_idnumber,cus_remark,cus_status,cus_level) VALUES(?,?,?,?,?,?,?,?)';
  try {
    for (let i = 1; i < number + 1; i++) {
      const {
        id,
        cus_name,
        cus_number,
        cus_email,
        cus_idnumber,
        cus_remark,
        cus_status,
        cus_level,
      } = createRandomUser();
      const insertParams = [
        id,
        cus_name,
        cus_number,
        cus_email,
        cus_idnumber,
        cus_remark,
        cus_status,
        cus_level,
      ];
      await pool.query(sqlString, insertParams);
    }
    console.log(`創建${number}筆資料結束`);
  } catch (err) {
    console.log(err);
  }
}
insertDb(100);
