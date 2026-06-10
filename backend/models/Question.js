const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    topic: { type: String, required: true },
    question: { type: String, required: true },
    options: {
        a: { type: String, required: true },
        b: { type: String, required: true },
        c: { type: String, required: true },
        d: { type: String, required: true },
        e: { type: String } // Optional, as some questions only go up to 'd'
    },
    correct_answer: { type: String, required: true },
    difficulty: { type: String, required: true, enum: ['Easy', 'Medium', 'Hard'] },
    explanation: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Question', questionSchema);