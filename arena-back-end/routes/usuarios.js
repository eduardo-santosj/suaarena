const express = require('express');
const router = express.Router();
const UsuariosService = require('../services/usuariosService');
const AuthService = require('../services/authService');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

router.get('/', auth, authorize(['admin']), async (req, res) => {
  try {
    const results = await UsuariosService.buscar();
    res.json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', auth, authorize(['admin']), async (req, res) => {
  try {
    const results = await UsuariosService.buscar(req.params.id);
    if (results.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.json({ success: true, data: results[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', auth, authorize(['admin']), async (req, res) => {
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

router.put('/:id', auth, authorize(['admin']), async (req, res) => {
  try {
    const updated = await UsuariosService.atualizar(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.json({ success: true, message: 'Usuário atualizado com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id/reativar-primeiro-acesso', auth, authorize(['admin']), async (req, res) => {
  try {
    await UsuariosService.reativarPrimeiroAcesso(req.params.id);
    res.json({ success: true, message: 'Primeiro acesso reativado. Nova senha: admin123' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', auth, authorize(['admin']), async (req, res) => {
  try {
    const deleted = await UsuariosService.deletar(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.json({ success: true, message: 'Usuário deletado com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;