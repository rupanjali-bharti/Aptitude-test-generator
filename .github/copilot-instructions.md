<!-- Aptitude Test Generator - Project-Specific Instructions -->

# Aptitude Test Generator - Development Guide

## Project Overview
A full-stack web application that generates customized aptitude tests based on company name and job description. Uses Gemini API to create tests with intelligent analysis showing weak/strong topics.

## Tech Stack
- Frontend: React.js
- Backend: Node.js (Express)
- Database: MongoDB
- Web Scraping: Cheerio + Axios
- LLM: Google Gemini API

## Setup Instructions

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- Google Gemini API key

### Backend Setup
1. Navigate to backend folder: `cd backend`
2. Install dependencies: `npm install`
3. Create `.env` file with:
   - `MONGODB_URI=your_mongodb_connection`
   - `GEMINI_API_KEY=your_gemini_key`
   - `PORT=5000`
4. Seed initial questions: `npm run seed`
5. Start server: `npm run dev`

### Frontend Setup
1. Navigate to frontend folder: `cd frontend`
2. Install dependencies: `npm install`
3. Create `.env` file with:
   - `REACT_APP_API_URL=http://localhost:5000`
4. Start dev server: `npm start`

## Project Structure
```
Aptitude-test-generator/
├── backend/
│   ├── models/          (MongoDB schemas)
│   ├── routes/          (API endpoints)
│   ├── controllers/      (Business logic)
│   ├── services/        (Gemini, Scraping, Analysis)
│   ├── config/          (Database, env config)
│   └── server.js        (Entry point)
├── frontend/
│   ├── src/
│   │   ├── components/  (React components)
│   │   ├── pages/       (Page components)
│   │   └── utils/       (Helper functions)
│   └── package.json
└── README.md
```

## Key Features
- Generate 5-6 tests per company using Gemini API
- Timed aptitude tests with real-time progress
- Web scraping for quality questions (indiabix-style)
- Detailed analytics showing:
  - Topic-wise performance
  - Weak and strong areas
  - Improvement suggestions
  - Comparison with average scores

## Development Workflow
1. Backend changes: Update models/controllers/services
2. Frontend changes: Update React components
3. API integration: Test with Postman/Thunder Client
4. Database: Use MongoDB Compass for inspection
