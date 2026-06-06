# Aptitude Test Generator

A full-stack web application that generates customized aptitude tests based on company name and job description. Uses Google Gemini API to create intelligent tests with detailed performance analysis.

## 🌟 Features

- **AI-Powered Test Generation**: Uses Google Gemini API to generate 5-6 unique tests per company
- **Timed Tests**: Real-time progress tracking with accurate timers
- **Web Scraping**: Fetches high-quality questions from sources like indiabix
- **Smart Analysis**: Post-test analytics showing:
  - Topic-wise performance breakdown
  - Weak and strong areas identification
  - Personalized improvement recommendations
  - Comparison insights
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile

## 🛠 Tech Stack

### Frontend
- React.js
- React Router for navigation
- Axios for API calls
- CSS3 for responsive styling

### Backend
- Node.js with Express.js
- MongoDB for data persistence
- Google Generative AI SDK
- Cheerio + Axios for web scraping

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- Google Gemini API key
- Git

## 🚀 Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Aptitude-test-generator
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your configuration
# MONGODB_URI=mongodb://localhost:27017/aptitude-test-generator
# GEMINI_API_KEY=your_gemini_api_key_here
# PORT=5000

# Start the backend server
npm run dev
```

The backend will start on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with API URL
# REACT_APP_API_URL=http://localhost:5000

# Start the frontend development server
npm start
```

The frontend will start on `http://localhost:3000`

## 📁 Project Structure

```
Aptitude-test-generator/
├── backend/
│   ├── config/              # Configuration files
│   │   ├── index.js         # Main config
│   │   └── database.js      # MongoDB connection
│   ├── models/              # MongoDB schemas
│   │   ├── Question.js      # Question schema
│   │   ├── Test.js          # Test schema
│   │   └── TestResult.js    # Test result schema
│   ├── controllers/          # Request handlers
│   │   └── testController.js
│   ├── routes/              # API routes
│   │   └── testRoutes.js
│   ├── services/            # Business logic
│   │   ├── geminiService.js     # Gemini API integration
│   │   ├── scraperService.js    # Web scraping logic
│   │   └── testService.js       # Test generation & analysis
│   ├── utils/               # Utility functions
│   ├── .env.example         # Environment variables template
│   ├── package.json
│   └── server.js            # Server entry point
│
├── frontend/
│   ├── public/
│   │   └── index.html       # HTML template
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── Test.js          # Test interface component
│   │   │   └── TestResults.js   # Results display component
│   │   ├── pages/           # Page components
│   │   │   ├── Home.js          # Home page
│   │   │   └── TestsList.js     # Tests list page
│   │   ├── styles/          # CSS styles
│   │   │   ├── Home.css
│   │   │   ├── Test.css
│   │   │   ├── TestsList.css
│   │   │   ├── TestResults.css
│   │   │   └── index.css
│   │   ├── utils/           # Utility functions
│   │   │   └── api.js       # API client
│   │   ├── App.js           # Main app component
│   │   ├── App.css
│   │   └── index.js         # React entry point
│   ├── .env.example
│   └── package.json
│
├── .github/
│   └── copilot-instructions.md
├── README.md
└── .gitignore
```

## 🔑 Getting Your Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the key and paste it in your `.env` file

## 📝 API Endpoints

### Generate Tests
```
POST /api/tests/generate
Body: {
  "company": "Google",
  "jobDescription": "Senior Software Engineer...",
  "numberOfTests": 6
}
```

### Get Company Tests
```
GET /api/tests/:company
```

### Submit Test
```
POST /api/tests/submit
Body: {
  "testId": "...",
  "userId": "...",
  "answers": [
    {
      "questionId": "...",
      "selectedAnswer": "Option A",
      "timeSpent": 45
    }
  ]
}
```

### Get Test Result
```
GET /api/tests/result/:resultId
```

## 🎯 How to Use

1. **Navigate to Home Page**: Enter company name and job description
2. **Generate Tests**: Click "Generate 6 Tests" - the system will create unique tests
3. **Take Tests**: Select a test and answer all questions within the time limit
4. **View Results**: See detailed analysis of your performance
5. **Improve**: Use recommendations to focus on weak areas

## 📊 Test Analysis Features

After completing a test, you'll receive:
- **Accuracy Score**: Overall percentage of correct answers
- **Topic Performance**: Break-down by topic (Quantitative, Logical, Verbal)
- **Weak Topics**: Areas scoring below 50%
- **Strong Topics**: Areas scoring 80% or higher
- **AI Insights**: Personalized strengths and improvement areas
- **Recommendations**: Specific study tips for improvement

## 🔧 Configuration

### Environment Variables

**Backend (.env)**:
```
MONGODB_URI=mongodb://localhost:27017/aptitude-test-generator
GEMINI_API_KEY=your_api_key
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

**Frontend (.env)**:
```
REACT_APP_API_URL=http://localhost:5000
```

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`
- Verify database is accessible

### Gemini API Error
- Verify API key is correct
- Check API key has proper permissions
- Ensure you're not exceeding rate limits

### Port Already in Use
- Change port in backend `.env`: `PORT=5001`
- Clear Node processes if needed

## 📚 Features in Detail

### Test Generation
- Uses Gemini to create company-specific questions
- Matches difficulty level of real online assessments
- Includes mix of topics relevant to job description

### Web Scraping
- Fetches questions from indiabix and similar sources
- Pre-scrapes and stores questions in database
- Fallback to AI generation if scraping unavailable

### Real-time Testing
- Live timer with visual indicators
- Progress tracking
- Question navigation
- Answer review before submission

### Analytics Engine
- Calculates accuracy and topic-wise performance
- Identifies weak and strong areas
- Uses Gemini for intelligent insights
- Generates personalized recommendations

## 🚢 Deployment

### Backend Deployment (Heroku/Railway)
```bash
cd backend
npm run build
git push heroku main
```

### Frontend Deployment (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy the build folder to your hosting service
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For issues and feature requests, please create an issue in the repository.

---

**Happy Learning! 🎓**
