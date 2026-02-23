const db = require('../db');
const bcrypt = require('bcrypt');

class AlunosService {
  static async cadastrar(dados) {
    return new Promise(async (resolve, reject) => {
      try {
        const { nome, cpf, email, idTurma, idPlano, status, valor_pago } = dados;
        
        // Verificar se CPF já existe
        const alunoExistente = await this.buscarPorCpf(cpf);
        if (alunoExistente) {
          reject(new Error('Aluno com este CPF já existe'));
          return;
        }
        
        // Criar hash da senha padrão
        const senhaHash = await bcrypt.hash('admin123', 10);
        
        // Inserir aluno
        db.query('INSERT INTO Alunos (nome, cpf, email, idTurma, idPlano, status, valor_pago, senha_padrao) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
          [nome, cpf, email, idTurma, idPlano, Number(status), valor_pago, senhaHash], 
          async (err, results) => {
            if (err) {
              reject(err);
              return;
            }
            
            const alunoId = results.insertId;
            
            // Criar login para o aluno
            try {
              const cpfLimpo = cpf.replace(/[^0-9]/g, '');
              await new Promise((resolveLogin, rejectLogin) => {
                db.query('INSERT INTO login (id, username, password, type) VALUES (?, ?, ?, ?)',
                  [alunoId, cpfLimpo, senhaHash, 'student'],
                  (errLogin) => {
                    if (errLogin) rejectLogin(errLogin);
                    else resolveLogin();
                  }
                );
              });
              
              resolve({ id: alunoId });
            } catch (errLogin) {
              // Se falhar ao criar login, deletar aluno
              db.query('DELETE FROM Alunos WHERE id = ?', [alunoId]);
              reject(new Error('Erro ao criar login do aluno'));
            }
          }
        );
      } catch (err) {
        reject(err);
      }
    });
  }

  static buscar(id = null, filtros = {}) {
    return new Promise((resolve, reject) => {
      if (id) {
        const sql = `
          SELECT a.*, t.nome AS nomeTurma, p.nome AS nomePlano
          FROM Alunos a
          LEFT JOIN Turmas t ON a.idTurma = t.id
          LEFT JOIN Planos p ON a.idPlano = p.id
          WHERE a.id = ?
        `;
        db.query(sql, [id], (err, results) => {
          if (err) reject(err);
          else resolve(results);
        });
      } else {
        let sql = 'SELECT a.*, t.nome AS nomeTurma, p.nome AS nomePlano FROM Alunos a LEFT JOIN Turmas t ON a.idTurma = t.id LEFT JOIN Planos p ON a.idPlano = p.id WHERE 1=1';
        const params = [];

        if (filtros.nome) {
          sql += ' AND a.nome LIKE ?';
          params.push(`%${filtros.nome}%`);
        }
        if (filtros.status && filtros.status !== 'todos') {
          sql += ' AND a.status = ?';
          let statusValue;
          if (filtros.status === 'ativo') {
            statusValue = 1;
          } else if (filtros.status === 'inativo') {
            statusValue = 0;
          } else {
            statusValue = Number(filtros.status);
          }
          params.push(statusValue);
        }
        if (filtros.idTurma && filtros.idTurma !== 'todos') {
          sql += ' AND a.idTurma = ?';
          params.push(filtros.idTurma);
        }

        db.query(sql, params, (err, results) => {
          if (err) reject(err);
          else resolve(results);
        });
      }
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
      if (dados.cpf !== undefined) {
        fields.push('cpf = ?');
        params.push(dados.cpf);
      }
      if (dados.email !== undefined) {
        fields.push('email = ?');
        params.push(dados.email);
      }
      if (dados.idTurma !== undefined) {
        fields.push('idTurma = ?');
        params.push(dados.idTurma);
      }
      if (dados.idPlano !== undefined) {
        fields.push('idPlano = ?');
        params.push(dados.idPlano);
      }
      if (dados.status !== undefined) {
        fields.push('status = ?');
        params.push(Number(dados.status));
      }
      if (dados.valor_pago !== undefined) {
        fields.push('valor_pago = ?');
        params.push(dados.valor_pago);
      }

      if (fields.length === 0) {
        reject(new Error('Nenhum campo para atualizar'));
        return;
      }

      params.push(id);
      const sql = `UPDATE Alunos SET ${fields.join(', ')} WHERE id = ?`;

      db.query(sql, params, (err, results) => {
        if (err) reject(err);
        else resolve(results.affectedRows > 0);
      });
    });
  }

  static deletar(id) {
    return new Promise((resolve, reject) => {
      db.query('DELETE FROM Alunos WHERE id = ?', [id], (err, results) => {
        if (err) reject(err);
        else resolve(results.affectedRows > 0);
      });
    });
  }

  static buscarPorCpf(cpf) {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM Alunos WHERE cpf = ?', [cpf], (err, results) => {
        if (err) reject(err);
        else resolve(results.length > 0 ? results[0] : null);
      });
    });
  }
}

module.exports = AlunosService;