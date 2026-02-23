const db = require('../db');

class PresencasService {
  static cadastrar(dados) {
    return new Promise((resolve, reject) => {
      const { idAluno, idTurma, data } = dados;
      
      // Buscar horário da turma
      db.query('SELECT horario FROM Turmas WHERE id = ?', [idTurma], (err, turmaResults) => {
        if (err) {
          reject(err);
          return;
        }
        
        if (turmaResults.length === 0) {
          reject(new Error('Turma não encontrada'));
          return;
        }
        
        const horarioTurma = turmaResults[0].horario;
        
        // Inserir presença com horário da turma
        db.query('INSERT INTO Presencas (idAluno, idTurma, data, horario) VALUES (?, ?, ?, ?)', 
          [idAluno, idTurma, data, horarioTurma], 
          (err, results) => {
            if (err) reject(err);
            else resolve({ id: results.insertId });
          }
        );
      });
    });
  }

  static buscar(id = null) {
    return new Promise((resolve, reject) => {
      let sql = id ? 'SELECT * FROM Presencas WHERE idAluno = ?' : 'SELECT * FROM Presencas';
      let params = id ? [id] : [];
      
      db.query(sql, params, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  }

  static atualizar(id, dados) {
    return new Promise((resolve, reject) => {
      const { idAluno, idTurma, data, horario } = dados;
      db.query('UPDATE Presencas SET idAluno = ?, idTurma = ?, data = ?, horario = ? WHERE id = ?',
        [idAluno, idTurma, data, horario, id],
        (err, results) => {
          if (err) reject(err);
          else resolve(results.affectedRows > 0);
        }
      );
    });
  }

  static deletar(id) {
    return new Promise((resolve, reject) => {
      db.query('DELETE FROM Presencas WHERE id = ?', [id], (err, results) => {
        if (err) reject(err);
        else resolve(results.affectedRows > 0);
      });
    });
  }
}

module.exports = PresencasService;