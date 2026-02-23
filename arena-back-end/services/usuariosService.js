const db = require('../db');
const bcrypt = require('bcrypt');

class UsuariosService {
  static buscar(id = null) {
    return new Promise((resolve, reject) => {
      if (id) {
        const sql = 'SELECT id, username, type FROM login WHERE id = ?';
        db.query(sql, [id], (err, results) => {
          if (err) reject(err);
          else resolve(results);
        });
      } else {
        const sql = 'SELECT id, username, type FROM login ORDER BY username';
        db.query(sql, (err, results) => {
          if (err) reject(err);
          else resolve(results);
        });
      }
    });
  }

  static atualizar(id, dados) {
    return new Promise(async (resolve, reject) => {
      try {
        const fields = [];
        const params = [];

        if (dados.username !== undefined) {
          fields.push('username = ?');
          params.push(dados.username);
        }
        if (dados.type !== undefined) {
          fields.push('type = ?');
          params.push(dados.type);
        }
        if (dados.password !== undefined) {
          const senhaHash = await bcrypt.hash(dados.password, 10);
          fields.push('password = ?');
          params.push(senhaHash);
        }

        if (fields.length === 0) {
          reject(new Error('Nenhum campo para atualizar'));
          return;
        }

        params.push(id);
        const sql = `UPDATE login SET ${fields.join(', ')} WHERE id = ?`;

        db.query(sql, params, (err, results) => {
          if (err) reject(err);
          else resolve(results.affectedRows > 0);
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  static reativarPrimeiroAcesso(id) {
    return new Promise(async (resolve, reject) => {
      try {
        const senhaHash = await bcrypt.hash('admin123', 10);
        
        // Atualizar login
        await new Promise((resolveLogin, rejectLogin) => {
          db.query('UPDATE login SET password = ? WHERE id = ?', [senhaHash, id], (err) => {
            if (err) rejectLogin(err);
            else resolveLogin();
          });
        });

        // Atualizar aluno se existir
        db.query('UPDATE Alunos SET primeiro_acesso = TRUE, senha_padrao = ? WHERE id = ?', 
          [senhaHash, id], (err) => {
          if (err) reject(err);
          else resolve(true);
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  static deletar(id) {
    return new Promise((resolve, reject) => {
      db.query('DELETE FROM login WHERE id = ?', [id], (err, results) => {
        if (err) reject(err);
        else resolve(results.affectedRows > 0);
      });
    });
  }
}

module.exports = UsuariosService;