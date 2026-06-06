# 🚀 Quick Start Guide

Get your Aptitude Test Generator up and running in 5 minutes!

## Prerequisites
- Node.js v16+ ([Download](https://nodejs.org/))
- MongoDB ([Local](https://www.mongodb.com/try/download/community) or [Atlas](https://www.mongodb.com/cloud/atlas))
- Google Gemini API Key ([Get here](https://makersuite.google.com/app/apikey))

## 1️⃣ Automatic Setup (Recommended)

### Windows
```bash
cd Aptitude-test-generator
setup.bat
```

### Linux/Mac
```bash
cd Aptitude-test-generator
bash setup.sh
```

## 2️⃣ Manual Setup

### Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Copy .env template and add your config
cp .env.example .env
# Edit .env:
# - MONGODB_URI=mongodb://localhost:27017/aptitude-test-generator
# - GEMINI_API_KEY=your_key_here

# Start server
npm run dev
```

Backend will run on **http://localhost:5000**

### Frontend Setup (in new terminal)
```bash
cd frontend

# Install dependencies
npm install

# Copy .env template
cp .env.example .env

# Start frontend
npm start
```

Frontend will open at **http://localhost:3000**

## 3️⃣ Verify Installation

- Backend API: http://localhost:5000/api/health
- Frontend: http://localhost:3000

## 🔑 Setting Up Gemini API

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click **"Create API Key"**
3. Copy the key
4. Paste in `backend/.env` → `GEMINI_API_KEY`

## 🗄️ MongoDB Setup

### Option A: Local MongoDB
```bash
# Install and start MongoDB
mongod
```

### Option B: MongoDB Atlas (Cloud)
1. Create account at [mongodb.com](https://www.mongodb.com)
2. Create cluster
3. Get connection string
4. Update `backend/.env` → `MONGODB_URI`

## 🧪 Test the Setup

1. Open http://localhost:3000
2. Enter a company name (e.g., "Google")
3. Add a job description
4. Click "Generate 6 Tests"
5. Complete a test and view results

## 🆘 Troubleshooting

### Port 3000 or 5000 already in use
```bash
# Kill process using the port or change port in .env
# Change PORT=5000 to PORT=5001 in backend/.env
```

### MongoDB Connection Error
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify database credentials

### Gemini API Error
- Verify API key is correct
- Check your API quota hasn't exceeded
- Ensure billing is enabled on Google Cloud

### Dependencies Installation Fails
```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules
npm install
```

## 📁 Key Folders

```
Aptitude-test-generator/
├── backend/         ← API & Database
├── frontend/        ← React UI
├── README.md        ← Full documentation
└── .github/         ← Project config
```

## 📚 Available Commands

### Backend
```bash
cd backend
npm run dev      # Start with auto-reload
npm start        # Start production
npm test         # Run tests
npm run seed     # Seed initial data
```

### Frontend
```bash
cd frontend
npm start        # Start dev server
npm run build    # Build for production
npm test         # Run tests
```

## ✨ Features to Try

1. **Generate Tests**: Input company details and generate AI-powered tests
2. **Take Tests**: Complete timed tests with real-time progress
3. **View Analytics**: See detailed performance breakdown
4. **Get Recommendations**: AI-powered improvement suggestions

## 🔐 Security Tips

- Never commit `.env` files
- Use strong passwords for MongoDB
- Keep Gemini API key secret
- Use HTTPS in production

## 📖 Learn More

- [Full README](README.md) - Complete documentation
- [Backend Setup](backend/README.md) - API details
- [Frontend Setup](frontend/README.md) - UI details

## 💬 Need Help?

Check the [README.md](README.md) for detailed information or create an issue in the repository.

---

Happy testing! 🎓
