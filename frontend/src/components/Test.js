import React, { useState, useEffect } from 'react';
import { submitTest } from '../utils/api';
import '../styles/Test.css';

function Test({ test, onTestComplete }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(test.totalDuration);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeSpentPerQuestion, setTimeSpentPerQuestion] = useState({});
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  const currentQuestion = test.questions[currentQuestionIndex];

  // Timer effect
  useEffect(() => {
    if (timeRemaining <= 0) {
      handleSubmitTest();
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectAnswer = (option) => {
    const timeSpent = Math.round((Date.now() - questionStartTime) / 1000);
    setAnswers({
      ...answers,
      [currentQuestion._id]: option,
    });
    setTimeSpentPerQuestion({
      ...timeSpentPerQuestion,
      [currentQuestion._id]: timeSpent,
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < test.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setQuestionStartTime(Date.now());
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setQuestionStartTime(Date.now());
    }
  };

  const handleSubmitTest = async () => {
    setLoading(true);
    setError('');

    try {
      const answersArray = test.questions.map((question) => ({
        questionId: question._id,
        selectedAnswer: answers[question._id] || '',
        timeSpent: timeSpentPerQuestion[question._id] || test.totalDuration / test.questions.length,
      }));

      const response = await submitTest(test._id, 'user_session_' + Date.now(), answersArray);
      onTestComplete(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error submitting test');
    } finally {
      setLoading(false);
    }
  };

  const progress = ((currentQuestionIndex + 1) / test.questions.length) * 100;
  const isAnswered = answers[currentQuestion?._id];

  return (
    <div className="test-container">
      <div className="test-header">
        <div className="timer" style={{ color: timeRemaining < 300 ? '#d32f2f' : '#2196f3' }}>
          {formatTime(timeRemaining)}
        </div>
        <div className="progress-info">
          Question {currentQuestionIndex + 1} of {test.questions.length}
        </div>
      </div>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="question-container">
        <h2 className="question-text">{currentQuestion?.text}</h2>
        <div className="difficulty-badge">{currentQuestion?.difficulty}</div>
        <div className="topic-badge">{currentQuestion?.topic}</div>

        <div className="options">
          {currentQuestion?.options.map((option, index) => (
            <label key={index} className="option-label">
              <input
                type="radio"
                name="answer"
                value={option}
                checked={answers[currentQuestion._id] === option}
                onChange={() => handleSelectAnswer(option)}
                disabled={loading}
              />
              <span className="option-text">{option}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="question-navigator">
        {currentQuestionIndex > 0 && (
          <button
            className="btn btn-secondary"
            onClick={handlePreviousQuestion}
            disabled={loading}
          >
            Previous
          </button>
        )}

        {currentQuestionIndex < test.questions.length - 1 && (
          <button
            className="btn btn-primary"
            onClick={handleNextQuestion}
            disabled={!isAnswered || loading}
          >
            Next
          </button>
        )}

        {currentQuestionIndex === test.questions.length - 1 && (
          <button
            className="btn btn-success"
            onClick={handleSubmitTest}
            disabled={loading || !isAnswered}
          >
            {loading ? 'Submitting...' : 'Submit Test'}
          </button>
        )}
      </div>

      <div className="question-grid">
        {test.questions.map((q, idx) => (
          <button
            key={idx}
            className={`question-number ${
              answers[q._id] ? 'answered' : ''
            } ${idx === currentQuestionIndex ? 'active' : ''}`}
            onClick={() => {
              setCurrentQuestionIndex(idx);
              setQuestionStartTime(Date.now());
            }}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Test;
