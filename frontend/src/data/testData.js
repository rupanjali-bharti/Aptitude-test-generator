import test1 from './test1.json';
import test2 from './test2.json';
import test3 from './test3.json';
import test4 from './test4.json';
import test5 from './test5.json';
import test6 from './test6.json';
import test7 from './test7.json';
import test8 from './test8.json';
import test9 from './test9.json';
import test10 from './test10.json';

const sources = { test1, test2, test3, test4, test5, test6, test7, test8, test9, test10 };

const normalizeQuestion = (question, index) => ({
  id: `${question.topic || 'question'}-${index}`,
  text: question.question || question.text || '',
  options: Object.entries(question.options || {}).map(([key, text]) => ({
    key: String(key).toLowerCase(),
    text,
  })),
  difficulty: question.difficulty || 'Easy',
  correctAnswer: String(question.correct_answer || question.correctAnswer || '').toLowerCase(),
  explanation: question.explanation || '',
  topic: question.topic || 'General',
});

export const tests = Object.entries(sources).map(([collectionName, questions]) => ({
  id: collectionName,
  title: collectionName,
  totalQuestions: Array.isArray(questions) ? questions.length : 0,
  questions: Array.isArray(questions) ? questions.map(normalizeQuestion) : [],
}));

export const getTests = () => tests;

export const getTestById = (id, includeAnswers = false) => {
  const test = tests.find((item) => item.id === id);
  if (!test) return null;
  return {
    ...test,
    questions: test.questions.map((question) => ({
      id: question.id,
      text: question.text,
      options: question.options,
      difficulty: question.difficulty,
      topic: question.topic,
      ...(includeAnswers
        ? {
            correctAnswer: question.correctAnswer,
            explanation: question.explanation,
          }
        : {}),
    })),
  };
};

const saveAttemptedTest = (testId) => {
  try {
    const existing = JSON.parse(localStorage.getItem('attemptedTests') || '[]');
    if (!existing.includes(testId)) {
      existing.push(testId);
      localStorage.setItem('attemptedTests', JSON.stringify(existing));
    }
  } catch {
    // ignore localStorage errors
  }
};

export const getStats = () => {
  const allQuestions = tests.reduce((sum, test) => sum + (test.questions?.length || 0), 0);
  const topicSet = new Set();
  tests.forEach((test) => {
    test.questions.forEach((q) => {
      if (q.topic) topicSet.add(q.topic);
    });
  });

  return {
    questionsGenerated: allQuestions,
    testsAvailable: tests.length,
    topicsCount: topicSet.size,
  };
};

export const submitAttempt = async ({ testId, userId, durationSelectedSeconds = 0, answers = [] }) => {
  const test = getTestById(testId, true);
  if (!test) throw new Error('Test not found');

  const score = answers.reduce((total, answer) => {
    const question = test.questions[answer.questionIndex];
    if (!question) return total;
    if (String(answer.selectedAnswer).toLowerCase() === String(question.correctAnswer).toLowerCase()) {
      return total + 1;
    }
    return total;
  }, 0);

  const attempt = {
    attemptId: `${testId}-${Date.now()}`,
    testId,
    userId,
    score,
    totalQuestions: test.questions.length,
    durationSelectedSeconds,
    answers,
  };

  saveAttemptedTest(testId);

  return {
    success: true,
    data: {
      attempt,
      test,
    },
  };
};
