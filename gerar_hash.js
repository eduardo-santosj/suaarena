const crypto = require('crypto');

// Função simples para gerar hash (não é bcrypt, mas funciona para teste)
function simpleHash(password) {
  return crypto.createHash('sha256').update(password + 'salt').digest('hex');
}

const senha = 'admin123';
const hash = simpleHash(senha);

console.log('DELETE FROM login WHERE username = "admin";');
console.log(`INSERT INTO login (username, password, type) VALUES ('admin', '${hash}', 'admin');`);
console.log('');
console.log('Username: admin');
console.log('Password: admin123');