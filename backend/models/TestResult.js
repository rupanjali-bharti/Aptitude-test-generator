const mongoose = require('mongoose');

const testResultSchema = new mongoose.Schema({
    userId: { type: String, required: true }, // Can be a session ID or actual user later
    score: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    timeTakenSeconds: { type: Number, required: true },
    answers: { type: Object, required: true } // Stores { questionId: 'a', questionId: 'c' }
}, { timestamps: true });

module.exports = mongoose.model('TestResult', testResultSchema);