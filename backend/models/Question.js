const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    options: {
      type: [String],
      required: true,
    },
    correctAnswer: {
      type: String,
      required: true,
    },
    topic: {
      type: String,
      required: true, // e.g., "Quantitative Aptitude", "Logical Reasoning", "Verbal"
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
    explanation: {
      type: String,
    },
    source: {
      type: String, // e.g., "indiabix", "gemini_generated"
    },
    company: {
      type: String,
    }, // Specific company if generated for that company
    timeLimit: {
      type: Number,
      default: 60, // seconds
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Question', questionSchema);
