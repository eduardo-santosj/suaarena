#!/bin/bash

# Script para executar na máquina AWS após o deploy
echo "Instalando dependências de produção..."
npm ci --only=production

echo "Reiniciando aplicação..."
pm2 restart arena-front-end || pm2 start npm --name "arena-front-end" -- start

echo "Deploy concluído!"