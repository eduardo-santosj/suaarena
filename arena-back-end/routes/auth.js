const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const AuthService = require('../services/authService');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const db = require('../db');
const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await AuthService.validarCredenciais(username, password);
    
    if (user) {
      const accessToken = jwt.sign(
        { 
          id: user.id, 
          username: user.username, 
          userType: user.type, 
          primeiroAcesso: user.primeiro_acesso,
          type: 'access' 
        }, 
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '15m' }
      );
      
      const refreshToken = jwt.sign(
        { 
          id: user.id, 
          username: user.username, 
          userType: user.type, 
          primeiroAcesso: user.primeiro_acesso,
          type: 'refresh' 
        }, 
        process.env.JWT_REFRESH_SECRET || 'refresh_secret',
        { expiresIn: '7d' }
      );
      
      res.json({ accessToken, refreshToken });
    } else {
      res.status(401).json({ error: 'Credenciais inválidas' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/register', auth, authorize(['admin']), async (req, res) => {
  try {
    const { username, password, type } = req.body;
    
    if (!username || !password || !type) {
      return res.status(400).json({ error: 'Username, password e tipo são obrigatórios' });
    }
    
    const user = await AuthService.criarUsuario(username, password, type);
    res.json({ success: true, message: 'Usuário criado com sucesso', user });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: 'Username já existe' });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

router.post('/trocar-senha', auth, async (req, res) => {
  try {
    const { senhaAtual, novaSenha } = req.body;
    const userId = req.user.id;
    
    // Buscar aluno
    const aluno = await new Promise((resolve, reject) => {
      db.query('SELECT * FROM Alunos WHERE id = ?', [userId], (err, results) => {
        if (err) reject(err);
        else resolve(results[0]);
      });
    });
    
    if (!aluno) {
      return res.status(404).json({ error: 'Aluno não encontrado' });
    }
    
    // Verificar senha atual
    const senhaValida = await bcrypt.compare(senhaAtual, aluno.senha_padrao);
    if (!senhaValida) {
      return res.status(401).json({ error: 'Senha atual incorreta' });
    }
    
    // Gerar nova senha hash
    const novaSenhaHash = await bcrypt.hash(novaSenha, 10);
    
    // Atualizar senha na tabela login
    await new Promise((resolve, reject) => {
      db.query(
        'UPDATE login SET password = ? WHERE id = ?',
        [novaSenhaHash, userId],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
    
    // Atualizar aluno
    await new Promise((resolve, reject) => {
      db.query(
        'UPDATE Alunos SET senha_padrao = ?, primeiro_acesso = FALSE WHERE id = ?',
        [novaSenhaHash, userId],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
    
    res.json({ success: true, message: 'Senha alterada com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/refresh', (req, res) => {
  const { refreshToken } = req.body;
  
  if (!refreshToken) {
    return res.status(401).json({ error: 'Refresh token não fornecido' });
  }
  
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'refresh_secret');
    
    if (decoded.type !== 'refresh') {
      return res.status(401).json({ error: 'Token inválido' });
    }
    
    const newAccessToken = jwt.sign(
      { id: decoded.id, username: decoded.username, userType: decoded.userType, type: 'access' },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '15m' }
    );
    
    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(401).json({ error: 'Refresh token inválido' });
  }
});

module.exports = router;