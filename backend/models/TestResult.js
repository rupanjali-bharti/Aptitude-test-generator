const mongoose = require('mongoose');

const questionResultSchema = new mongoose.Schema({
    questionId: { type: String, required: true },
    text: { type: String },
    topic: { type: String },
    options: { type: Array },
    correctAnswer: { type: String },
    explanation: { type: String },
    userAnswer: { type: String },
    isCorrect: { type: Boolean, required: true }
}, { _id: false });

const testResultSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    score: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    timeTakenSeconds: { type: Number, required: true },
    answers: { type: Object, required: true },
    questions: { type: Array, default: [] },
    questionResults: { type: [questionResultSchema], default: [] },
    level: { type: String, default: 'Medium' },
    questionCount: { type: Number, default: 10 },
    duration: { type: Number, default: 30 },
    percentage: { type: Number, default: 0 },
    analysis: { type: Object, default: {} }
}, { timestamps: true });

module.exports = mongoose.model('TestResult', testResultSchema);