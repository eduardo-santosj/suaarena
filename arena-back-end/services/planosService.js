const db = require('../db');

class PlanosService {
  static cadastrar(dados) {
    return new Promise((resolve, reject) => {
      const { nome, treinos_por_semana, valor } = dados;
      
      db.query('INSERT INTO Planos (nome, treinos_por_semana, valor) VALUES (?, ?, ?)', 
        [nome, treinos_por_semana, valor], 
        (err, results) => {
          if (err) reject(err);
          else resolve({ id: results.insertId });
        }
      );
    });
  }

  static buscar(id = null) {
    return new Promise((resolve, reject) => {
      let sql = id 
        ? 'SELECT p.*, COUNT(a.id) as total_alunos FROM Planos p LEFT JOIN Alunos a ON p.id = a.idPlano WHERE p.id = ? GROUP BY p.id'
        : 'SELECT p.*, COUNT(a.id) as total_alunos FROM Planos p LEFT JOIN Alunos a ON p.id = a.idPlano GROUP BY p.id ORDER BY p.nome';
      let params = id ? [id] : [];
      
      db.query(sql, params, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  }

  static atualizar(id, dados) {
    return new Promise((resolve, reject) => {
      const fields = [];
      const params = [];

      if (dados.nome !== undefined) {
        fields.push('nome = ?');
        params.push(dados.nome);
      }
      if (dados.treinos_por_semana !== undefined) {
        fields.push('treinos_por_semana = ?');
        params.push(dados.treinos_por_semana);
      }
      if (dados.valor !== undefined) {
        fields.push('valor = ?');
        params.push(dados.valor);
      }
      if (dados.ativo !== undefined) {
        fields.push('ativo = ?');
        params.push(dados.ativo);
      }

      if (fields.length === 0) {
        reject(new Error('Nenhum campo para atualizar'));
        return;
      }

      params.push(id);
      const sql = `UPDATE Planos SET ${fields.join(', ')} WHERE id = ?`;

      db.query(sql, params, (err, results) => {
        if (err) reject(err);
        else resolve(results.affectedRows > 0);
      });
    });
  }

  static deletar(id) {
    return new Promise((resolve, reject) => {
      db.query('DELETE FROM Planos WHERE id = ?', [id], (err, results) => {
        if (err) reject(err);
        else resolve(results.affectedRows > 0);
      });
    });
  }
}

module.exports = PlanosService;