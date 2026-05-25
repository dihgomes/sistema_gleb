@echo off
title Tunel Cloudflare - Sistema GLEB
color 0A

echo ========================================
echo   TUNEL CLOUDFLARE - SISTEMA GLEB
echo ========================================
echo.
echo Dominio: https://controle-hrrb.com.br
echo Tunel: gleb-sistema
echo ID: d1dfca62-2c9f-466b-935c-61da56c11ef4
echo.
echo ========================================
echo.

echo INFO: Verificando se o frontend esta rodando...
echo INFO: O frontend deve estar em: http://localhost:5173
echo.

echo AVISO: Certifique-se de que o frontend esta rodando antes de continuar!
echo AVISO: Execute: npm run dev (na pasta frontend)
echo.

pause

echo.
echo INFO: Iniciando tunel Cloudflare...
echo.

cd /d "%~dp0"

cloudflared tunnel --config cloudflare-tunnel-config.yml run

if errorlevel 1 (
    echo.
    echo ERRO: Falha ao iniciar o tunel!
    echo.
    echo Possiveis causas:
    echo - Cloudflared nao esta instalado
    echo - Arquivo de configuracao nao encontrado
    echo - Credenciais invalidas
    echo.
    pause
    exit /b 1
)

pause
