@echo off
REM Aptitude Test Generator - Quick Start Script for Windows

echo.
echo 🚀 Aptitude Test Generator - Setup Script
echo ===========================================
echo.

REM Check Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js v16+
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✓ Node.js is installed: %NODE_VERSION%
echo.

REM Setup Backend
echo 📦 Setting up Backend...
cd backend

if not exist ".env" (
    echo Creating .env file from template...
    copy .env.example .env
    echo ⚠️  Please update backend\.env with your MongoDB URI and Gemini API key
)

if not exist "node_modules" (
    echo Installing backend dependencies...
    call npm install
) else (
    echo ✓ Backend dependencies already installed
)

cd ..
echo.

REM Setup Frontend
echo 📦 Setting up Frontend...
cd frontend

if not exist ".env" (
    echo Creating .env file from template...
    copy .env.example .env
)

if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install
) else (
    echo ✓ Frontend dependencies already installed
)

cd ..
echo.

echo ✅ Setup Complete!
echo.
echo 📋 Next Steps:
echo 1. Update backend\.env with your MongoDB URI and Gemini API Key
echo 2. Start MongoDB (if using local)
echo 3. Run: npm run dev (in backend folder)
echo 4. Run: npm start (in frontend folder)
echo.
echo 🌐 Frontend will open at: http://localhost:3000
echo 🔌 Backend will run on: http://localhost:5000
echo.
pause
