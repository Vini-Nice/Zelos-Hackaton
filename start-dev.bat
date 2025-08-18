@echo off
echo ========================================
echo    SISTEMA ZELOS - DESENVOLVIMENTO
echo ========================================
echo.
echo Iniciando servicos...
echo.

echo [1/3] Iniciando Backend (porta 8080)...
start "Backend Zelos" cmd /k "cd backend && echo Backend iniciado na porta 8080 && echo Pressione qualquer tecla para parar... && node app.js"

echo [2/3] Aguardando backend inicializar...
timeout /t 3 /nobreak >nul

echo [3/3] Iniciando Frontend (porta 3000)...
start "Frontend Zelos" cmd /k "cd frontend && echo Frontend iniciado na porta 3000 && echo Pressione qualquer tecla para parar... && npm run dev"

echo.
echo ========================================
echo Servicos iniciados com sucesso!
echo.
echo Backend:  http://localhost:8080
echo Frontend: http://localhost:3000
echo.
echo Pressione qualquer tecla para fechar...
echo ========================================
pause >nul
