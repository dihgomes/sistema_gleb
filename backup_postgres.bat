@echo off
echo ========================================
echo   Backup PostgreSQL - Sistema GLEB
echo ========================================
echo.

set BACKUP_FILE=gleb_backup_%date:~-4,4%%date:~-7,2%%date:~-10,2%_%time:~0,2%%time:~3,2%%time:~6,2%.dump
set BACKUP_FILE=%BACKUP_FILE: =0%

echo Criando backup do banco de dados...
echo Arquivo: %BACKUP_FILE%
echo.

pg_dump -U postgres -d gleb_db -F c -f %BACKUP_FILE%

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   Backup criado com sucesso!
    echo ========================================
    echo.
    echo Arquivo: %BACKUP_FILE%
    echo.
    echo Agora voce pode copiar este arquivo para o servidor.
    echo.
) else (
    echo.
    echo ========================================
    echo   ERRO ao criar backup!
    echo ========================================
    echo.
    echo Verifique se o PostgreSQL esta rodando
    echo e se as credenciais estao corretas.
    echo.
)

pause
