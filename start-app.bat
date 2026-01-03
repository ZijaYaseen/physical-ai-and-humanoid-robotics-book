@echo off
echo Starting RAG Chatbot Application...
echo.

echo Checking prerequisites...
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is not installed or not in PATH
    pause
    exit /b 1
)

node --version >nul 2>&1
if errorlevel 1 (
    echo Error: Node.js is not installed or not in PATH
    pause
    exit /b 1
)

echo Prerequisites check passed.
echo.

echo Installing Python dependencies...
pip install -r requirements.txt
if errorlevel 1 (
    echo Error: Failed to install Python dependencies
    pause
    exit /b 1
)

echo.
echo Installing Node.js dependencies...
npm install
if errorlevel 1 (
    echo Error: Failed to install Node.js dependencies
    pause
    exit /b 1
)

echo.
echo Starting the application in development mode...
echo.
echo Note: This will start both the backend (port 8000) and frontend (port 3000)
echo Press Ctrl+C twice to stop both servers
echo.
npm run dev