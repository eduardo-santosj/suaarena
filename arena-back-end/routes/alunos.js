
const express = require('express');
const router = express.Router();
const AlunosService = require('../services/alunosService');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

router.get('/all', auth, authorize(['admin', 'teacher']), async (req, res) => {
  try {
    const results = await AlunosService.buscar();
    res.json({success: true, data: results});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', auth, authorize(['admin', 'teacher']), async (req, res) => {
  try {
    const { nome, status, idTurma } = req.query;
    const results = await AlunosService.buscar(null, { nome, status, idTurma });
    res.json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', auth, authorize(['admin', 'teacher']), async (req, res) => {
  try {
    const results = await AlunosService.buscar(req.params.id);
    if (results.length === 0) {
      return res.status(404).json({ error: 'Aluno não encontrado' });
    }
    res.json({ success: true, data: results[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



router.post('/', auth, authorize(['admin', 'teacher']), async (req, res) => {
  try {
    const { nome, cpf, idTurma, status, valor_pago } = req.body;
    
    if (!cpf) {
      return res.status(400).json({ success: false, error: 'CPF é obrigatório' });
    }
    
    const result = await AlunosService.cadastrar(req.body);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.put('/:id', auth, authorize(['admin', 'teacher']), async (req, res) => {
  try {
    const updated = await AlunosService.atualizar(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Aluno não encontrado' });
    }
    const aluno = await AlunosService.buscar(req.params.id);
    res.json(aluno[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/contagem-por-turma', auth, authorize(['admin', 'teacher']), async (req, res) => {
  try {
    const results = await AlunosService.buscar();
    const contagem = results.reduce((acc, aluno) => {
      acc[aluno.idTurma] = (acc[aluno.idTurma] || 0) + 1;
      return acc;
    }, {});
    res.json(Object.entries(contagem).map(([idTurma, totalAlunos]) => ({ idTurma, totalAlunos })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', auth, authorize(['admin', 'teacher']), async (req, res) => {
  try {
    const deleted = await AlunosService.deletar(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Aluno não encontrado' });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
