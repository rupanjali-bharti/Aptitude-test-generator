#!/bin/bash

# Aptitude Test Generator - Quick Start Script

echo "🚀 Aptitude Test Generator - Setup Script"
echo "==========================================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js (v16+)"
    exit 1
fi

echo "✓ Node.js is installed: $(node --version)"
echo ""

# Setup Backend
echo "📦 Setting up Backend..."
cd backend

if [ ! -f ".env" ]; then
    echo "Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please update backend/.env with your MongoDB URI and Gemini API key"
fi

if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
else
    echo "✓ Backend dependencies already installed"
fi

cd ..
echo ""

# Setup Frontend
echo "📦 Setting up Frontend..."
cd frontend

if [ ! -f ".env" ]; then
    echo "Creating .env file from template..."
    cp .env.example .env
fi

if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
else
    echo "✓ Frontend dependencies already installed"
fi

cd ..
echo ""

echo "✅ Setup Complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Update backend/.env with your MongoDB URI and Gemini API Key"
echo "2. Start MongoDB (if using local)"
echo "3. Run: npm run dev (in backend folder)"
echo "4. Run: npm start (in frontend folder)"
echo ""
echo "🌐 Frontend will open at: http://localhost:3000"
echo "🔌 Backend will run on: http://localhost:5000"
