const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const TestResult = require('../models/TestResult');
const { buildDifficultyQuery, resolveQuestionCount } = require('../utils/difficulty');
const { buildTestAnalysis } = require('../utils/analytics');

// 1. Generate a Test (Fetch random questions)
router.post('/generate', async (req, res) => {
    try {
        // 1. See exactly what the frontend sent
        console.log("\n--- NEW TEST REQUEST ---");
        console.log("1. Received Body:", req.body); 

        // 2. Set safe defaults so it NEVER searches for 'undefined'
        const level = req.body.level || "Medium";
        const duration = req.body.duration || 30;
        const numberOfQuestions = resolveQuestionCount(req.body.questionCount || req.body.numberOfQuestions, 10);

        const rawCheck = await Question.findOne({});
        console.log("DIAGNOSTIC - Here is ONE document from your DB:", rawCheck);
        
        // 3. Build the query
        const matchQuery = buildDifficultyQuery(level);
        console.log("2. Searching MongoDB for:", matchQuery);

        // 4. Fetch from database
        const questions = await Question.aggregate([
            { $match: matchQuery },
            { $sample: { size: numberOfQuestions } }
        ]);

        console.log(`3. SUCCESS! Found ${questions.length} questions.`);
        
        // 5. Send to frontend
        res.status(200).json({ questions });

    } catch (error) {
        console.error("❌ Error generating test:", error);
        res.status(500).json({ error: "Failed to generate test" });
    }
});

// 2. Submit Test Results
router.post('/submit', async (req, res) => {
    try {
        const { userId, answers, score, timeTaken, questions = [], level, questionCount, duration } = req.body;

        const totalQuestions = questions.length || Object.keys(answers).length;
        const analysis = buildTestAnalysis({
            questions,
            answers,
            score,
            totalQuestions,
            level,
            questionCount,
            duration,
            timeTakenSeconds: timeTaken
        });

        const questionResults = questions.map((question) => {
            const questionId = question._id || question.id || question.questionId;
            const userAnswer = answers[questionId];
            const correctAnswer = question.correctAnswer || question.correct_answer || question.correct || '';
            return {
                questionId,
                text: question.text || question.question || '',
                topic: question.topic || 'General',
                options: Array.isArray(question.options) ? question.options : Object.values(question.options || {}),
                correctAnswer,
                explanation: question.explanation || '',
                userAnswer,
                isCorrect: userAnswer === correctAnswer
            };
        });
        
        const newResult = new TestResult({
            userId,
            score,
            totalQuestions,
            timeTakenSeconds: timeTaken,
            answers,
            questions,
            questionResults,
            level,
            questionCount,
            duration,
            percentage: analysis.percentage,
            analysis
        });

        await newResult.save();
        res.status(201).json({ message: "Test submitted successfully", resultId: newResult._id, result: newResult });
    } catch (error) {
        console.error("Error submitting test:", error);
        res.status(500).json({ error: "Failed to submit test" });
    }
});

router.get('/results', async (req, res) => {
    try {
        const results = await TestResult.find({}).sort({ createdAt: -1 });
        res.status(200).json(results);
    } catch (error) {
        console.error("Error fetching results:", error);
        res.status(500).json({ error: "Failed to fetch results" });
    }
});

router.get('/stats', async (req, res) => {
    try {
        const [questionsCount, testsCount, topics] = await Promise.all([
            Question.countDocuments({}),
            TestResult.countDocuments({}),
            Question.distinct('topic')
        ]);

        res.status(200).json({
            questionsGenerated: questionsCount,
            testsAttempted: testsCount,
            topicsCount: topics.length,
            topics
        });
    } catch (error) {
        console.error("Error fetching stats:", error);
        res.status(500).json({ error: "Failed to fetch stats" });
    }
});

module.exports = router;