// hash-passwords.js
const bcrypt = require('bcrypt');

const passwords = ['<adminpassword>', '<viewerpassword>'];
const saltRounds = 10;

passwords.forEach(password => {
  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      console.error('Error hashing password:', err);
      return;
    }
    console.log(`Password: ${password}, Hash: ${hash}`);
  });
});
