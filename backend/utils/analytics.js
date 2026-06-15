function getCorrectAnswer(question) {
  return question.correctAnswer || question.correct_answer || question.correct || '';
}

function getQuestionOptions(question) {
  if (Array.isArray(question.options)) {
    return question.options;
  }

  if (question.options && typeof question.options === 'object') {
    return Object.values(question.options);
  }

  return [];
}

function buildTestAnalysis({ questions = [], answers = {}, score = 0, totalQuestions = questions.length, level = 'Medium', questionCount = 10, duration = 30, timeTakenSeconds = 0 }) {
  const safeTotal = totalQuestions || questions.length || 0;
  const percentage = safeTotal > 0 ? Number(((score / safeTotal) * 100).toFixed(1)) : 0;

  const topicMap = new Map();
  const questionResults = questions.map((question) => {
    const questionId = question._id || question.id || question.questionId;
    const userAnswer = answers[questionId] || null;
    const correctAnswer = getCorrectAnswer(question);
    const isCorrect = userAnswer !== null && userAnswer === correctAnswer;

    if (!topicMap.has(question.topic)) {
      topicMap.set(question.topic, { total: 0, correct: 0 });
    }

    const topicStats = topicMap.get(question.topic);
    topicStats.total += 1;
    if (isCorrect) {
      topicStats.correct += 1;
    }

    return {
      questionId,
      text: question.text || question.question || '',
      topic: question.topic || 'General',
      options: getQuestionOptions(question),
      correctAnswer,
      explanation: question.explanation || '',
      userAnswer,
      isCorrect
    };
  });

  const topicPerformance = Array.from(topicMap.entries())
    .map(([topic, stats]) => ({
      topic,
      correct: stats.correct,
      total: stats.total,
      accuracy: stats.total > 0 ? Number(((stats.correct / stats.total) * 100).toFixed(1)) : 0
    }))
    .sort((a, b) => b.accuracy - a.accuracy);

  const strongTopics = topicPerformance.filter((topic) => topic.accuracy >= 70).map((topic) => topic.topic);
  const weakTopics = topicPerformance.filter((topic) => topic.accuracy < 50).map((topic) => topic.topic);

  const recommendations = [];
  if (weakTopics.length > 0) {
    recommendations.push(`Spend extra time revising ${weakTopics.slice(0, 2).join(', ')}.`);
  }
  if (strongTopics.length > 0) {
    recommendations.push(`Keep practicing ${strongTopics.slice(0, 2).join(', ')} to maintain consistency.`);
  }
  recommendations.push('Review the explanations for every incorrect answer to strengthen your reasoning.');

  return {
    percentage,
    score,
    totalQuestions: safeTotal,
    level,
    questionCount,
    duration,
    timeTakenSeconds,
    topicPerformance,
    strongTopics,
    weakTopics,
    recommendations,
    summary: percentage >= 70
      ? 'Excellent performance. You are showing strong command over the selected topics.'
      : percentage >= 50
        ? 'Solid effort. You are on the right track, with a few areas to sharpen.'
        : 'You can improve further by revisiting the weaker topics and reviewing the explanations.'
  };
}

module.exports = {
  buildTestAnalysis
};
