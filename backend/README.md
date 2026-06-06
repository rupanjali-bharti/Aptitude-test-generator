# Backend API Documentation

## Overview
Express.js backend server providing REST API for the Aptitude Test Generator application.

## Base URL
```
http://localhost:5000/api
```

## Endpoints

### 1. Generate Tests for Company
**POST** `/tests/generate`

Generate 5-6 unique aptitude tests for a specific company.

**Request:**
```json
{
  "company": "Google",
  "jobDescription": "Senior Software Engineer with 5+ years of experience...",
  "numberOfTests": 6
}
```

**Response (201):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "test_id_1",
      "company": "Google",
      "jobDescription": "...",
      "questions": ["question_ids..."],
      "totalQuestions": 15,
      "totalDuration": 900,
      "topics": ["Quantitative Aptitude", "Logical Reasoning"]
    }
  ],
  "message": "Generated 6 tests for Google"
}
```

### 2. Get Company Tests
**GET** `/tests/:company`

Retrieve all generated tests for a company.

**Response (200):**
```json
{
  "success": true,
  "data": [...],
  "count": 6
}
```

### 3. Submit Test Answers
**POST** `/tests/submit`

Submit answers and get test results with analysis.

**Request:**
```json
{
  "testId": "test_id_1",
  "userId": "user_123",
  "answers": [
    {
      "questionId": "question_id_1",
      "selectedAnswer": "Option A",
      "timeSpent": 45
    }
  ]
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "result_id",
    "score": 12,
    "totalQuestions": 15,
    "accuracy": 80,
    "topicPerformance": {
      "Quantitative Aptitude": {
        "correct": 8,
        "total": 10,
        "percentage": 80
      }
    },
    "weakTopics": [],
    "strongTopics": ["Quantitative Aptitude"],
    "analysis": {
      "strengths": ["Strong quantitative skills"],
      "improvements": ["Practice logical reasoning"],
      "recommendations": ["Focus on time management"]
    }
  }
}
```

### 4. Get Test Result
**GET** `/tests/result/:resultId`

Get detailed analysis for a completed test.

**Response (200):**
```json
{
  "success": true,
  "data": { /* result object */ }
}
```

### 5. Health Check
**GET** `/health`

Check if server is running.

**Response (200):**
```json
{
  "message": "Server is running"
}
```

## Error Responses

**400 - Bad Request:**
```json
{
  "success": false,
  "message": "Company name and job description are required"
}
```

**404 - Not Found:**
```json
{
  "success": false,
  "message": "Test result not found"
}
```

**500 - Server Error:**
```json
{
  "success": false,
  "message": "Error generating tests",
  "error": "Error details"
}
```

## Database Models

### Question
```javascript
{
  text: String,
  options: [String],
  correctAnswer: String,
  topic: String,
  difficulty: "easy|medium|hard",
  explanation: String,
  source: String,
  company: String,
  timeLimit: Number
}
```

### Test
```javascript
{
  company: String,
  jobDescription: String,
  questions: [ObjectId],
  totalQuestions: Number,
  totalDuration: Number,
  topics: [String],
  difficulty: String
}
```

### TestResult
```javascript
{
  testId: ObjectId,
  userId: String,
  answers: [{
    questionId: ObjectId,
    selectedAnswer: String,
    isCorrect: Boolean,
    topic: String,
    timeSpent: Number
  }],
  score: Number,
  accuracy: Number,
  topicPerformance: Object,
  weakTopics: [String],
  strongTopics: [String],
  analysis: {
    strengths: [String],
    improvements: [String],
    recommendations: [String]
  }
}
```

## Technologies Used
- Express.js - Web framework
- MongoDB - Database
- Mongoose - ODM
- Google Generative AI - LLM
- Axios - HTTP client
- Cheerio - Web scraping

## Configuration
See `.env.example` for required environment variables.
