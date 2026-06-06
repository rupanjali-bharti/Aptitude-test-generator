const mongoose = require('mongoose');

const testSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: true,
    },
    jobDescription: {
      type: String,
    },
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
      },
    ],
    totalQuestions: {
      type: Number,
      required: true,
    },
    totalDuration: {
      type: Number, // in seconds
      required: true,
    },
    topics: [String], // Topics covered in the test
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
    generatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Test', testSchema);
