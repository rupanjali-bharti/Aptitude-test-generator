# AptiAce - Aptitude Test Generator

A clean aptitude testing frontend with a backend-ready structure for AI-generated questions and analytics.

## What this repo contains

- React frontend with glass-style test cards
- Test list, timed test flow, and results-ready UI
- Node/Express backend scaffold and MongoDB support
- Local attempted-state tracking and future-ready test slots

## Quick start

```bash
git clone <repository-url>
cd Aptitude-test-generator
```

### Backend

```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

### Frontend

```bash
cd ../frontend
npm install
copy .env.example .env
npm start
```

## Notes

- Backend defaults to `http://localhost:5000`
- Frontend defaults to `http://localhost:3000`
- Add `GEMINI_API_KEY` in `backend/.env`

## Project layout

- `backend/` - API, models, services, routes
- `frontend/` - React app, pages, styles, utils
- `data-extraction/` - data import scripts and assets

## Why this is useful

- Ready to extend with more aptitude categories
- Clean UI separation for cards and page layout
- Simple setup for development

## Run commands

- `npm run dev` in `backend`
- `npm start` in `frontend`

If you want, I can also turn this into a one-page README with only setup and feature highlights.
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
