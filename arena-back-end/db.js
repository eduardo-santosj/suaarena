require('dotenv').config();
const mysql = require('mysql2');

let connection;

function createConnection() {
  connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306
  });

  connection.connect(err => {
    if (err) {
      console.error('Erro ao conectar ao MySQL:', err);
      setTimeout(createConnection, 2000);
    } else {
      console.log('Conectado ao MySQL');
    }
  });

  connection.on('error', err => {
    console.error('Erro na conexão MySQL:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNRESET') {
      createConnection();
    }
  });
}

createConnection();

module.exports = connection;