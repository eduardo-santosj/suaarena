const db = require('../db');

class TurmasService {
  static cadastrar(dados) {
    return new Promise((resolve, reject) => {
      const { nome, horario, capacidade_maxima, dias_semana } = dados;
      const diasJson = dias_semana ? JSON.stringify(dias_semana) : null;
      
      db.query('INSERT INTO Turmas (nome, horario, capacidade_maxima, dias_semana) VALUES (?, ?, ?, ?)', 
        [nome, horario, capacidade_maxima || 20, diasJson], 
        (err, results) => {
          if (err) reject(err);
          else resolve({ id: results.insertId });
        }
      );
    });
  }

  static buscar(id = null) {
    return new Promise((resolve, reject) => {
      let sql = id ? 'SELECT * FROM Turmas WHERE id = ?' : 'SELECT * FROM Turmas';
      let params = id ? [id] : [];
      
      db.query(sql, params, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  }

  static atualizar(id, dados) {
    return new Promise((resolve, reject) => {
      const { nome, horario, capacidade_maxima, dias_semana } = dados;
      const diasJson = dias_semana ? JSON.stringify(dias_semana) : null;
      
      db.query('UPDATE Turmas SET nome = ?, horario = ?, capacidade_maxima = ?, dias_semana = ? WHERE id = ?',
        [nome, horario, capacidade_maxima || 20, diasJson, id],
        (err, results) => {
          if (err) reject(err);
          else resolve(results.affectedRows > 0);
        }
      );
    });
  }

  static deletar(id) {
    return new Promise((resolve, reject) => {
      db.query('DELETE FROM Turmas WHERE id = ?', [id], (err, results) => {
        if (err) reject(err);
        else resolve(results.affectedRows > 0);
      });
    });
  }
}

module.exports = TurmasService;