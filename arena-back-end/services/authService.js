const db = require('../db');
const bcrypt = require('bcrypt');

class AuthService {
  static async validarCredenciais(username, password) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT l.id, l.username, l.password, l.type, 
               COALESCE(a.primeiro_acesso, FALSE) as primeiro_acesso
        FROM login l
        LEFT JOIN Alunos a ON l.id = a.id
        WHERE l.username = ?
      `;
      db.query(sql, [username], async (err, results) => {
        if (err) {
          reject(err);
          return;
        }
        
        if (results.length === 0) {
          resolve(null);
          return;
        }
        
        const user = results[0];
        const senhaValida = await bcrypt.compare(password, user.password);
        
        if (senhaValida) {
          resolve(user);
        } else {
          resolve(null);
        }
      });
    });
  }

  static async criarUsuario(username, password, type = 'student') {
    return new Promise(async (resolve, reject) => {
      try {
        const senhaHash = await bcrypt.hash(password, 10);
        const sql = 'INSERT INTO login (username, password, type) VALUES (?, ?, ?)';
        
        db.query(sql, [username, senhaHash, type], (err, results) => {
          if (err) reject(err);
          else resolve({ id: results.insertId, username, type });
        });
      } catch (err) {
        reject(err);
      }
    });
  }
}

module.exports = AuthService;