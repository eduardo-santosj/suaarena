# SuaArena - Sistema de Gestão de Academia

Sistema completo para gestão de academia com controle de alunos, turmas, presenças e check-ins.

## Tecnologias

- **Frontend**: Next.js 15, React 19, TypeScript, TailwindCSS
- **Backend**: Node.js, Express
- **Banco de dados**: MySQL/MariaDB

## Estrutura do Projeto

```
SuaArena/
├── arena-front-end/    # Aplicação Next.js
└── arena-back-end/     # API REST Node.js
```

## Configuração Local

### Backend

1. Entre na pasta:
```bash
cd arena-back-end
```

2. Instale dependências:
```bash
npm install
```

3. Configure variáveis de ambiente:
```bash
cp .env.example .env
# Edite o .env com suas credenciais
```

4. Inicie o servidor:
```bash
npm run dev
```

### Frontend

1. Entre na pasta:
```bash
cd arena-front-end
```

2. Instale dependências:
```bash
npm install
```

3. Configure variáveis de ambiente:
```bash
cp .env.example .env
# Edite o .env com a URL do backend
```

4. Inicie o servidor:
```bash
npm run dev
```

## Deploy

- **Frontend**: Vercel
- **Backend**: Render.com
- **Banco de dados**: Clever Cloud MySQL

## Licença

Desenvolvido por Edu Santos
