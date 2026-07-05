import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/TestResults.css';

export default function ResultsView() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result || location.state || null;

  if (!result) return <div className="loading">Result not found</div>;

  const { attempt, test, questionResults } = result;

  const score = attempt.score;
  const total = attempt.totalQuestions;
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  const status = percentage >= 70 ? 'Great job!' : percentage >= 50 ? 'Good effort!' : 'Keep practicing!';

  return (
    <div className="test-results-container">
      <div className="results-header">
        <h1>Results for {test.title}</h1>
        <p className="results-subtitle">{status} You completed the 30-minute test.</p>
        <div className="score-circle">
          <span className="score-value">{percentage}%</span>
          <span className="score-label">Accuracy</span>
        </div>
        <div className="results-summary">
          <div className="summary-card">
            <h3>Score</h3>
            <p className="summary-value">{score} / {total}</p>
          </div>
          <div className="summary-card">
            <h3>Total Questions</h3>
            <p className="summary-value">{total}</p>
          </div>
          <div className="summary-card">
            <h3>Time Limit</h3>
            <p className="summary-value">30 min</p>
          </div>
          <div className="summary-card">
            <h3>Status</h3>
            <p className="summary-value">{status}</p>
          </div>
        </div>
        <div className="results-actions">
          <button className="btn btn-secondary" onClick={() => navigate('/tests')}>← Back to Tests</button>
        </div>
      </div>

      <div className="detailed-review">
        <h2>Question Review</h2>
        {questionResults.map((q, idx) => (
          <div key={idx} className={`review-card ${q.selectedAnswer === q.correctAnswer ? 'correct-card' : 'wrong-card'}`}>
            <p><strong>{idx + 1}.</strong> {q.text}</p>
            <div className="review-options">
              {(q.options || []).map((opt, oi) => {
                const optText = opt.text || opt;
                const key = opt.key || String(oi);
                const isCorrect = String(key).toLowerCase() === String(q.correctAnswer).toLowerCase() || String(optText).toLowerCase() === String(q.correctAnswer).toLowerCase();
                const isSelected = String(key).toLowerCase() === String(q.selectedAnswer).toLowerCase() || String(optText).toLowerCase() === String(q.selectedAnswer).toLowerCase();
                let cls = 'review-option';
                if (isCorrect) cls += ' correct-option';
                else if (isSelected && !isCorrect) cls += ' wrong-option';
                return <div key={oi} className={cls}>{optText}</div>;
              })}
            </div>
            <div className="explanation-box">
              <h4>Explanation</h4>
              <p>{q.explanation || 'No explanation provided.'}</p>
              <p className="small-muted">Time spent: {q.timeSpentSeconds}s</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
