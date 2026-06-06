const Question = require('../models/Question');
const Test = require('../models/Test');
const TestResult = require('../models/TestResult');
const geminiService = require('./geminiService');
const scraperService = require('./scraperService');

class TestService {
  async generateTestsForCompany(company, jobDescription, numberOfTests = 6) {
    try {
      const tests = [];
      const questionsPerTest = 15;
      const topics = ['Quantitative Aptitude', 'Logical Reasoning', 'Verbal Ability'];

      for (let i = 0; i < numberOfTests; i++) {
        // Generate questions using Gemini
        const generatedQuestions = await geminiService.generateTestQuestions(
          company,
          jobDescription,
          questionsPerTest
        );

        // Save questions to database
        const savedQuestions = [];
        for (const question of generatedQuestions) {
          const newQuestion = new Question({
            ...question,
            company: company,
            source: 'gemini_generated',
          });
          const saved = await newQuestion.save();
          savedQuestions.push(saved._id);
        }

        // Calculate total duration (1 minute per question average)
        const totalDuration = questionsPerTest * 60;

        // Create test
        const newTest = new Test({
          company: company,
          jobDescription: jobDescription,
          questions: savedQuestions,
          totalQuestions: questionsPerTest,
          totalDuration: totalDuration,
          topics: [...new Set(generatedQuestions.map(q => q.topic))],
        });

        const savedTest = await newTest.save();
        tests.push(await savedTest.populate('questions'));
      }

      return tests;
    } catch (error) {
      console.error('Error generating tests:', error);
      throw error;
    }
  }

  async getTestsForCompany(company) {
    try {
      return await Test.find({ company: company })
        .populate('questions')
        .sort({ generatedAt: -1 });
    } catch (error) {
      console.error('Error fetching tests:', error);
      throw error;
    }
  }

  async submitTestResult(testId, userId, answers) {
    try {
      const test = await Test.findById(testId).populate('questions');
      if (!test) throw new Error('Test not found');

      let score = 0;
      const topicPerformance = {};
      const answeredQuestions = [];

      // Calculate score and topic-wise performance
      for (const answer of answers) {
        const question = test.questions.find(q => q._id.toString() === answer.questionId);
        if (question) {
          const isCorrect = answer.selectedAnswer === question.correctAnswer;
          if (isCorrect) score++;

          // Initialize topic if not exists
          if (!topicPerformance[question.topic]) {
            topicPerformance[question.topic] = { correct: 0, total: 0 };
          }

          topicPerformance[question.topic].total++;
          if (isCorrect) topicPerformance[question.topic].correct++;

          answeredQuestions.push({
            questionId: question._id,
            selectedAnswer: answer.selectedAnswer,
            isCorrect: isCorrect,
            topic: question.topic,
            timeSpent: answer.timeSpent || 60,
          });
        }
      }

      // Calculate accuracy and topic percentages
      const accuracy = (score / test.totalQuestions) * 100;
      const weakTopics = [];
      const strongTopics = [];

      for (const [topic, performance] of Object.entries(topicPerformance)) {
        const percentage = (performance.correct / performance.total) * 100;
        topicPerformance[topic].percentage = percentage;

        if (percentage < 50) weakTopics.push(topic);
        if (percentage >= 80) strongTopics.push(topic);
      }

      // Get analysis from Gemini
      const analysis = await geminiService.analyzeTestResults(
        { score, totalQuestions: test.totalQuestions, accuracy },
        topicPerformance
      );

      // Save test result
      const testResult = new TestResult({
        testId: testId,
        userId: userId,
        answers: answeredQuestions,
        score: score,
        totalQuestions: test.totalQuestions,
        accuracy: accuracy,
        topicPerformance: topicPerformance,
        weakTopics: weakTopics,
        strongTopics: strongTopics,
        analysis: {
          strengths: analysis.strengths || [],
          improvements: analysis.improvements || [],
          recommendations: analysis.recommendations || [],
        },
      });

      return await testResult.save();
    } catch (error) {
      console.error('Error submitting test result:', error);
      throw error;
    }
  }

  async getTestResult(resultId) {
    try {
      return await TestResult.findById(resultId).populate('testId');
    } catch (error) {
      console.error('Error fetching test result:', error);
      throw error;
    }
  }
}

module.exports = new TestService();
