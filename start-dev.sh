#!/bin/bash

echo "========================================"
echo "    SISTEMA ZELOS - DESENVOLVIMENTO"
echo "========================================"
echo ""
echo "Iniciando servicos..."
echo ""

echo "[1/3] Iniciando Backend (porta 8080)..."
cd backend
gnome-terminal --title="Backend Zelos" -- bash -c "echo 'Backend iniciado na porta 8080'; echo 'Pressione Ctrl+C para parar...'; node app.js; exec bash" &
cd ..

echo "[2/3] Aguardando backend inicializar..."
sleep 3

echo "[3/3] Iniciando Frontend (porta 3000)..."
cd frontend
gnome-terminal --title="Frontend Zelos" -- bash -c "echo 'Frontend iniciado na porta 3000'; echo 'Pressione Ctrl+C para parar...'; npm run dev; exec bash" &
cd ..

echo ""
echo "========================================"
echo "Servicos iniciados com sucesso!"
echo ""
echo "Backend:  http://localhost:8080"
echo "Frontend: http://localhost:3000"
echo ""
echo "Pressione Enter para fechar..."
echo "========================================"
read
