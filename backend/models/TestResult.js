const mongoose = require('mongoose');

const testResultSchema = new mongoose.Schema(
  {
    testId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Test',
      required: true,
    },
    userId: {
      type: String, // Can be session ID or user ID
      required: true,
    },
    answers: [
      {
        questionId: mongoose.Schema.Types.ObjectId,
        selectedAnswer: String,
        isCorrect: Boolean,
        topic: String,
        timeSpent: Number, // in seconds
      },
    ],
    score: {
      type: Number,
      required: true,
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
    accuracy: {
      type: Number, // percentage
      required: true,
    },
    topicPerformance: {
      type: Map,
      of: {
        correct: Number,
        total: Number,
        percentage: Number,
      },
    },
    weakTopics: [String],
    strongTopics: [String],
    completedAt: {
      type: Date,
      default: Date.now,
    },
    analysis: {
      strengths: [String],
      improvements: [String],
      recommendations: [String],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('TestResult', testResultSchema);
