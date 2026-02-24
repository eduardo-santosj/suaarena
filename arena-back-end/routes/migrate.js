const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/run', async (req, res) => {
  const migrations = [
    'ALTER TABLE Alunos ADD COLUMN cpf VARCHAR(14) DEFAULT NULL',
    'ALTER TABLE Alunos ADD COLUMN idTurma INT DEFAULT NULL',
    'ALTER TABLE Alunos ADD COLUMN status TINYINT(1) DEFAULT 1',
    'ALTER TABLE Alunos ADD COLUMN valor_pago DECIMAL(10,2) DEFAULT NULL'
  ];

  const results = [];

  for (const sql of migrations) {
    try {
      await new Promise((resolve, reject) => {
        db.query(sql, (err, result) => {
          if (err) {
            if (err.code === 'ER_DUP_FIELDNAME') {
              results.push({ sql, status: 'já existe' });
              resolve();
            } else {
              reject(err);
            }
          } else {
            results.push({ sql, status: 'executado' });
            resolve(result);
          }
        });
      });
    } catch (err) {
      results.push({ sql, status: 'erro', message: err.message });
    }
  }

  res.json({ success: true, results });
});

module.exports = router;
