# AptiAce - Aptitude Test Generator

An AI-powered aptitude practice platform that generates customized tests and provides detailed performance analytics. Master aptitude questions, track your progress, and build the speed needed to crack placement tests with confidence.

## 🌟 Key Features

- **Custom Test Configuration**: Choose difficulty level (Easy, Medium, Hard, Mixed), number of questions (15-30), and time limits
- **AI-Powered Question Generation**: Google Gemini API generates unique, placement-relevant questions
- **Real-Time Test Interface**: Live timer, progress tracking, and question navigation with review functionality
- **Comprehensive Analytics Dashboard**: 
  - Accuracy trends across last 10 tests
  - Questions solved breakdown (Attempted, Correct, Incorrect, Skipped)
  - Topic-wise strength analysis with color-coded performance (Strong/Needs Improvement/Weak)
  - Weak areas detection with actionable insights
  - Average time per question metrics
  - Readiness score calculation
- **Test History**: Complete list of all attempted tests with scores, accuracy, and difficulty
- **Performance Tracking**: Persists all test data for long-term progress monitoring
- **Responsive Design**: Fully responsive across desktop, tablet, and mobile devices

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
│   │   └── TestResult.js    # Test result with analytics schema
│   ├── controllers/          # Request handlers
│   │   └── testController.js
│   ├── routes/              # API routes
│   │   └── test.js          # Test endpoints
│   ├── services/            # Business logic
│   │   ├── geminiService.js     # Gemini API integration
│   │   ├── scraperService.js    # Web scraping logic
│   │   └── testService.js       # Test generation
│   ├── utils/               # Utility functions
│   │   ├── difficulty.js        # Difficulty filtering & normalization
│   │   └── analytics.js         # Test analysis engine
│   ├── tests/               # Unit tests
│   │   └── difficulty.test.js
│   ├── .env.example         # Environment variables template
│   ├── package.json
│   └── server.js            # Server entry point
│
├── frontend/
│   ├── public/
│   │   └── index.html       # HTML template
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── Test.js          # Test-taking interface
│   │   │   └── TestResults.js   # Post-test results view
│   │   ├── pages/           # Page components
│   │   │   ├── Home.js          # Landing & test configuration page
│   │   │   ├── TestsList.js     # List of available static tests
│   │   │   ├── TestTaking.js    # Test-taking page with per-question timing
│   │   │   └── ResultsView.js   # Results / review view for an attempt
│   │   ├── styles/          # CSS styles
│   │   │   ├── Home.css         # Landing page styles
│   │   │   ├── Test.css         # Test interface styles
│   │   │   └── TestResults.css  # Results page styles
│   │   │   └── index.css
│   │   ├── utils/           # Utility functions
│   │   │   └── api.js       # API client wrapper
│   │   ├── App.js           # Main app with routing
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

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Create API Key" in a new project
3. Copy the generated API key
4. Paste it in your backend `.env` file as `GEMINI_API_KEY=your_key_here`

**Note**: This API key is used for generating intelligent questions and providing personalized recommendations.

## 📝 API Endpoints

### Generate Test
```
POST /api/tests/generate
Body: {
  "level": "Medium",          # Easy, Medium, Hard, or Mixed
  "questionCount": 20,        # 15, 20, 25, or 30
  "duration": 30              # Time limit in minutes
}
Response: {
  "questions": [
    {
      "_id": "...",
      "text": "Question text",
      "topic": "Quantitative Aptitude",
      "difficulty": "medium",
      "options": { "A": "...", "B": "...", "C": "...", "D": "..." },
      "correctAnswer": "A",
      "explanation": "..."
    }
  ]
}
```

### Submit Test Result
```
POST /api/tests/submit
Body: {
  "userId": "...",
  "answers": { "questionId": "selectedAnswer", ... },
  "score": 18,
  "timeTaken": 1800,          # Seconds
  "questions": [...],         # Full question objects
  "level": "Medium",
  "questionCount": 20,
  "duration": 30
}
Response: {
  "message": "Test submitted successfully",
  "resultId": "...",
  "result": { "...": "..." }
}
```

### Get All Test Results
```
GET /api/tests/results
Response: [
  {
    "_id": "...",
    "score": 18,
    "totalQuestions": 20,
    "percentage": 90,
    "level": "Medium",
    "timeTakenSeconds": 1800,
    "analysis": {
      "topicPerformance": [
        { "topic": "Quantitative", "accuracy": 85, "correct": 17, "total": 20 },
        ...
      ],
      "strongTopics": ["Quantitative", "Logical Reasoning"],
      "weakTopics": ["Verbal Ability"],
      "recommendations": [...]
    },
    "createdAt": "2026-06-15T10:30:00Z"
  }
]
```

### Get Platform Statistics
```
GET /api/tests/stats
Response: {
  "questionsGenerated": 500,
  "testsAttempted": 45,
  "topicsCount": 6,
  "topics": ["Quantitative Aptitude", "Logical Reasoning", ...]
}
```

## 🎯 How to Use

1. **Home Page**: Visit the AptiAce landing page with your profile overview
   - Quickly adjust test configuration (difficulty, number of questions, time limit)
   - View platform statistics and key metrics
   
2. **Configure Test**: Select your preferred settings
   - **Difficulty**: Choose between Easy, Medium, Hard, or Mixed
   - **Questions**: Select 15, 20, 25, or 30 questions
   - **Time Limit**: Set 15, 30, 45, or 60 minutes
   
3. **Take Test**: Answer questions with real-time progress tracking
   - Live timer with visual progress bar
   - Navigate between questions freely
   - Review and modify answers before submission
   
4. **View Results**: See post-test analysis
   - Correct/incorrect answers with explanations
   - Time spent on each question
   - Topic-wise performance breakdown
   
5. **Analytics Dashboard**: Track progress over time
   - View last 10 attempts with scores and difficulty
   - Analyze accuracy trends
   - Identify weak and strong topics
   - Get personalized improvement recommendations

## 📊 Test Analysis Features

After completing a test, you'll receive:

- **Accuracy Score**: Overall percentage of correct answers
- **Question Analysis**: Attempted, Correct, Incorrect, and Skipped question counts
- **Topic Performance**: Detailed breakdown showing:
  - Topic name and accuracy percentage
  - Number of correct vs total questions per topic
  - Status indicators (Strong: 70%+, Needs Improvement: 50-70%, Weak: <50%)
- **Strong Topics**: Areas where you're performing well (70% or higher)
- **Weak Topics**: Areas for improvement (below 50%)
- **Time Metrics**: Average time spent per question
- **Personalized Recommendations**: AI-generated suggestions for improvement
- **Readiness Score**: Overall preparation level calculation

## ⚡ Quick Start

In the root directory:
```bash
# Backend setup
cd backend
npm install
npm run dev  # Server starts on localhost:5000

# In another terminal, frontend setup
cd frontend
npm install
npm start    # App opens on localhost:3000
```

Ensure MongoDB is running and `.env` files are configured with required API keys.

## � Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB (local or MongoDB Atlas)
- Google Gemini API key

### Backend Setup

1. Navigate to backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/aptitude-test-generator
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

4. Start the backend server:
```bash
npm run dev
```

The server will start on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
REACT_APP_API_URL=http://localhost:5000
```

4. Start the development server:
```bash
npm start
```

The app will open on `http://localhost:3000`

### Running Tests

In the backend folder, run:
```bash
npm test
```

This runs the Jest test suite for utilities like difficulty normalization and question count validation.

## 🐛 Troubleshooting

### MongoDB Connection Error
```
MongooseError: Unable to connect to the database
```
**Solution:**
- Ensure MongoDB is running: `mongod`
- Check your `MONGODB_URI` in `.env` file
- If using MongoDB Atlas, verify your IP is whitelisted in Network Access settings
- Test connection: `mongo "mongodb://localhost:27017"`

### Gemini API Error
```
Error: API key not found or invalid
```
**Solution:**
- Verify your API key is correctly copied to `.env`
- Check the key has no extra spaces or quotes
- Ensure API key has "Google Gemini API" permission enabled
- Regenerate key if needed from Google AI Studio

### CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution:**
- Ensure backend is running on port 5000
- Check `CORS_ORIGIN` in backend `.env` matches frontend URL (default: `http://localhost:3000`)
- Verify frontend `.env` has correct `REACT_APP_API_URL=http://localhost:5000`

### Port Already in Use
```
Error: listen EADDRINUSE :::5000
```
**Solution:**
- Change port in backend `.env`: `PORT=5001`
- Restart the backend server
- Or kill the process: `lsof -ti:5000 | xargs kill -9`

### Tests Not Running
```
Jest: No tests found
```
**Solution:**
- Ensure you're in the backend directory
- Run: `npm test -- --testPathPattern=difficulty`
- Check that test files exist in `backend/tests/` folder

### Dashboard Shows No Data
- Ensure at least one test has been completed and submitted
- Check browser console for API errors
- Verify backend is running: `curl http://localhost:5000/api/tests/stats`

## 📚 Features in Detail

### Test Generation
- Dynamic difficulty-based filtering (Easy, Medium, Hard, Mixed)
- Configurable question count (15-30 questions)
- Flexible time limits (15-60 minutes)
- Questions pulled from MongoDB question bank
- Fallback to Gemini API for content generation if needed

### Test Interface
- Real-time countdown timer with visual progress
- Question progress tracking (X of Y)
- One-question-per-screen layout for focus
- Review answers before final submission
- Category/topic indicators for each question

### Results Analysis
- Post-test detailed answer review with explanations
- Immediate accuracy calculation
- Time tracking per question
- Topic-wise performance breakdown
- Identification of strong and weak areas

### Analytics Dashboard
- **Latest Test Metrics**: Score, accuracy, time taken, difficulty level
- **Performance Trends**: Accuracy across last 10 tests (visual chart)
- **Questions Analysis**: 
  - Total attempted, correct, incorrect, and skipped
  - Visual breakdown chart
  - Metrics per question
- **Topic Strength**: Color-coded performance for each topic
  - Green: 70%+ (Strong)
  - Yellow: 50-70% (Needs Improvement)
  - Red: <50% (Weak)
- **Attempt History**: Chronological list of all tests with:
  - Sequential numbering (Aptitude Test 1, 2, 3...)
  - Date and time of attempt
  - Score and accuracy percentage
  - Difficulty level and time taken
  - Quick links to detailed results
- **Weak Areas Recommendations**: Targeted study suggestions based on performance

### Difficulty Normalization
- Case-insensitive filtering ensures robust queries
- "Mixed" level returns questions across all difficulties
- Safe question count parsing (min 5, max 50)
- Validated through Jest unit tests

### Data Persistence
- All test results stored in MongoDB
- Results include complete answer history
- Topic-wise analysis stored with each result
- Historical data enables progress tracking over time

## 🚢 Deployment

### Backend Deployment (Railway/Heroku/Render)

1. Push your code to GitHub:
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. Set up environment variables on your hosting platform:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `GEMINI_API_KEY`: Your Gemini API key
   - `CORS_ORIGIN`: Your frontend URL (e.g., `https://your-frontend.vercel.app`)
   - `NODE_ENV`: Set to `production`

3. Deploy using platform-specific commands or GitHub integration

### Frontend Deployment (Vercel/Netlify)

1. Build the production bundle:
```bash
cd frontend
npm run build
```

2. Deploy using Vercel CLI:
```bash
npm install -g vercel
vercel --prod
```

   Or push to GitHub and connect to Netlify for automatic deployments

3. Add environment variable in deployment platform:
   - `REACT_APP_API_URL`: Your backend API URL (e.g., `https://your-backend.railway.app`)

### Docker Deployment (Optional)

Create a `Dockerfile` in both backend and frontend directories for containerized deployment on AWS, GCP, or similar platforms.

## 💻 Technology Stack

- **Frontend**: React.js, React Router, Axios, CSS3
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **AI Integration**: Google Gemini API
- **Testing**: Jest
- **Web Scraping**: Cheerio, Axios (for content collection)
- **Deployment**: Vercel (Frontend), Railway/Render (Backend)

## 🤝 Contributing

Contributions are welcome! Here's how to contribute:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/AmazingFeature`
3. Make your changes and commit: `git commit -m 'Add AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

Please ensure:
- Code follows the existing style
- Backend tests pass: `npm test`
- Frontend builds without warnings: `npm run build`
- All new features include appropriate tests

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support & Feedback

- **Report Issues**: Create an issue in the repository for bugs and feature requests
- **Questions**: Reach out via GitHub Discussions or create an issue with the "question" label
- **Email**: For serious inquiries, contact the project maintainer

## 🎓 Learning Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [React Documentation](https://react.dev/)
- [Express.js Guide](https://expressjs.com/)
- [Google Gemini API](https://ai.google.dev/)
- [Aptitude Test Tips](https://www.indiabix.com/)

---

**Made with ❤️ by the AptiAce Team**

**Happy Learning! 🎓**

### Data Persistence
- All test results stored in MongoDB
- Results include complete answer history
- Topic-wise analysis stored with each result
- Historical data enables progress tracking over time

## 🚢 Deployment

### Backend Deployment (Railway/Heroku/Render)

1. Push your code to GitHub:
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. Set up environment variables on your hosting platform:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `GEMINI_API_KEY`: Your Gemini API key
   - `CORS_ORIGIN`: Your frontend URL (e.g., `https://your-frontend.vercel.app`)
   - `NODE_ENV`: Set to `production`

3. Deploy using platform-specific commands or GitHub integration

### Frontend Deployment (Vercel/Netlify)

1. Build the production bundle:
```bash
cd frontend
npm run build
```

2. Deploy using Vercel CLI:
```bash
npm install -g vercel
vercel --prod
```

   Or push to GitHub and connect to Netlify for automatic deployments

3. Add environment variable in deployment platform:
   - `REACT_APP_API_URL`: Your backend API URL (e.g., `https://your-backend.railway.app`)

### Docker Deployment (Optional)

Create a `Dockerfile` in both backend and frontend directories for containerized deployment on AWS, GCP, or similar platforms.

## 💻 Technology Stack

- **Frontend**: React.js, React Router, Axios, CSS3
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **AI Integration**: Google Gemini API
- **Testing**: Jest
- **Web Scraping**: Cheerio, Axios (for content collection)
- **Deployment**: Vercel (Frontend), Railway/Render (Backend)

## 🤝 Contributing

Contributions are welcome! Here's how to contribute:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/AmazingFeature`
3. Make your changes and commit: `git commit -m 'Add AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

Please ensure:
- Code follows the existing style
- Backend tests pass: `npm test`
- Frontend builds without warnings: `npm run build`
- All new features include appropriate tests

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support & Feedback

- **Report Issues**: Create an issue in the repository for bugs and feature requests
- **Questions**: Reach out via GitHub Discussions or create an issue with the "question" label
- **Email**: For serious inquiries, contact the project maintainer

## 🎓 Learning Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [React Documentation](https://react.dev/)
- [Express.js Guide](https://expressjs.com/)
- [Google Gemini API](https://ai.google.dev/)
- [Aptitude Test Tips](https://www.indiabix.com/)

---

**Made with ❤️ by the AptiAce Team**

**Happy Learning! 🎓**
