@echo off
title Sistema GLEB - Inicializacao Completa
color 0B

echo ========================================
echo   SISTEMA GLEB - INICIALIZACAO COMPLETA
echo ========================================
echo.
echo Este script ira iniciar:
echo 1. Backend (localhost:5001)
echo 2. Frontend (localhost:5173)
echo 3. Tunel Cloudflare (controle-hrrb.com.br + api.controle-hrrb.com.br)
echo.
echo ========================================
echo.

pause

echo.
echo [1/3] Iniciando Backend...
echo.

start "GLEB - Backend" cmd /k "cd /d %~dp0backend && npm run dev"

timeout /t 3 /nobreak >nul

echo.
echo [2/3] Iniciando Frontend...
echo.

start "GLEB - Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

timeout /t 5 /nobreak >nul

echo.
echo [3/3] Iniciando Tunel Cloudflare...
echo.

timeout /t 3 /nobreak >nul

start "GLEB - Tunel Cloudflare" cmd /k "cd /d %~dp0 && cloudflared tunnel --config cloudflare-tunnel-backend-config.yml run"

echo.
echo ========================================
echo   SISTEMA INICIADO COM SUCESSO!
echo ========================================
echo.
echo Acesse:
echo - Frontend Local: http://localhost:5173/admin/login
echo - Frontend Publico: https://controle-hrrb.com.br/admin/login
echo - Backend Local: http://localhost:5001/health
echo - Backend Publico: https://api.controle-hrrb.com.br/health
echo.
echo Pressione qualquer tecla para fechar esta janela...
echo (As outras janelas continuarao rodando)
echo.

pause
