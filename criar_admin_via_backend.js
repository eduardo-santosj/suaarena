const bcrypt = require('bcrypt');
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '@Ama163638',
  database: 'ederneguinho'
});

async function criarAdmin() {
  try {
    // Deletar admin existente
    await new Promise((resolve, reject) => {
      db.query('DELETE FROM login WHERE username = ?', ['admin'], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Criar hash da senha
    const senhaHash = await bcrypt.hash('admin123', 10);
    
    // Gerar query SQL para executar no servidor
    const querySQL = `INSERT INTO login (username, password, type) VALUES ('admin', '${senhaHash}', 'admin')`;
    console.log('Query SQL para executar no servidor:');
    console.log(querySQL);
    
    // Inserir novo admin
    await new Promise((resolve, reject) => {
      db.query('INSERT INTO login (username, password, type) VALUES (?, ?, ?)', 
        ['admin', senhaHash, 'admin'], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    console.log('Admin criado com sucesso!');
    console.log('Username: admin');
    console.log('Password: admin123');
    
  } catch (error) {
    console.error('Erro:', error);
  } finally {
    db.end();
  }
}

criarAdmin();