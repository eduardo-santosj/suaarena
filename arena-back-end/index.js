
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001', 
  'http://localhost:3002',
  'http://localhost:3003',
  'http://localhost:3007',
  process.env.FRONTEND_URL // URL do Vercel
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(bodyParser.json());

const authRoutes = require('./routes/auth');
const alunosRoutes = require('./routes/alunos');
const turmasRoutes = require('./routes/turmas');
const presencasRoutes = require('./routes/presencas');
const checkinRoutes = require('./routes/checkin');
const dashboardRoutes = require('./routes/dashboard');
const usuariosRoutes = require('./routes/usuarios');
const planosRoutes = require('./routes/planos');
const migrateRoutes = require('./routes/migrate');
const quadrasRoutes = require('./routes/quadras');

app.get('/', (req, res) => {
  res.json({ message: 'Backend funcionando!', status: 'online', timestamp: new Date() });
});

app.use('/api/auth', authRoutes);
app.use('/api/alunos', alunosRoutes);
app.use('/api/turmas', turmasRoutes);
app.use('/api/presencas', presencasRoutes);
app.use('/api/checkin', checkinRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/planos', planosRoutes);
app.use('/api/quadras', quadrasRoutes);
app.use('/api/perfil', require('./routes/perfil'));
app.use('/api/migrate', migrateRoutes);

const PORT = process.env.PORT || 3008;
app.listen(PORT, () => console.log(`Backend rodando na porta ${PORT}`));
