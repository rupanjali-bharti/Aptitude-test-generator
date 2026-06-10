const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const TestResult = require('../models/TestResult');

// 1. Generate a Test (Fetch random questions)
router.post('/generate', async (req, res) => {
    try {
        // 1. See exactly what the frontend sent
        console.log("\n--- NEW TEST REQUEST ---");
        console.log("1. Received Body:", req.body); 

        // 2. Set safe defaults so it NEVER searches for 'undefined'
        const level = req.body.level || "Medium";
        const duration = req.body.duration || 30;
        const numberOfQuestions = parseInt(duration);

        const rawCheck = await Question.findOne({});
        console.log("DIAGNOSTIC - Here is ONE document from your DB:", rawCheck);
        
        // 3. Build the query
        let matchQuery = {};
        if (level !== 'Mixed') {
            matchQuery.difficulty = level;
        }
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

// 2. Submit Test Results (Unchanged)
router.post('/submit', async (req, res) => {
    try {
        const { userId, answers, score, timeTaken } = req.body;
        
        const newResult = new TestResult({
            userId,
            score,
            totalQuestions: Object.keys(answers).length,
            timeTakenSeconds: timeTaken,
            answers
        });

        await newResult.save();
        res.status(201).json({ message: "Test submitted successfully", resultId: newResult._id });
    } catch (error) {
        console.error("Error submitting test:", error);
        res.status(500).json({ error: "Failed to submit test" });
    }
});

module.exports = router;