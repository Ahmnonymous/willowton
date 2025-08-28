@echo off
echo ========================================
echo Starting Backend, Frontend and Nginx
echo ========================================

REM ===== Start Backend =====
@REM cd /d D:\WORK\LUQMAN\WillowTon_react\willowTon\backend
cd /d C:\willowton\backend
call forever stop server.js >nul 2>&1
call forever start -a -l backend.log -o backend-out.log -e backend-err.log server.js

REM ===== Start Frontend =====
@REM cd /d D:\WORK\LUQMAN\WillowTon_react\willowTon\frontend
cd /d C:\willowton\frontend
call forever stop "npx serve -s build -l 3000" >nul 2>&1
call forever start -a -l frontend.log -o frontend-out.log -e frontend-err.log node_modules\serve\build\main.js -s build -l 3000

REM ===== Start Nginx =====
cd /d C:\nginx
start nginx.exe

echo ========================================
echo Backend ^& Frontend are running with Forever
echo Nginx is started
echo ========================================
pause
