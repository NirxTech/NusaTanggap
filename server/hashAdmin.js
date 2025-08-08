// hashAdmin.js
const bcrypt = require('bcrypt');

const password = 'NusaTanggap2025'; // password admin asli

bcrypt.hash(password, 12, (err, hash) => {
  if (err) throw err;
  console.log('Hash bcrypt untuk password admin:');
  console.log(hash);
});