import React from 'react';
import '../styles/TestResults.css';

function TestResults({ result, onBackClick }) {
  const getPercentageColor = (percentage) => {
    if (percentage >= 80) return '#4caf50'; // Green
    if (percentage >= 60) return '#ff9800'; // Orange
    return '#f44336'; // Red
  };

  return (
    <div className="results-container">
      <button className="btn btn-secondary" onClick={onBackClick}>
        ← Back to Tests
      </button>

      <div className="results-header">
        <h1>Test Results</h1>
        <div className="score-circle">
          <div
            className="score-value"
            style={{ color: getPercentageColor(result.accuracy) }}
          >
            {result.accuracy.toFixed(1)}%
          </div>
          <div className="score-label">Accuracy</div>
        </div>
      </div>

      <div className="results-summary">
        <div className="summary-card">
          <h3>Score</h3>
          <p className="summary-value">
            {result.score}/{result.totalQuestions}
          </p>
        </div>
        <div className="summary-card">
          <h3>Questions Answered</h3>
          <p className="summary-value">{result.answers.filter(a => a.selectedAnswer).length}/{result.totalQuestions}</p>
        </div>
      </div>

      <div className="analysis-section">
        <h2>Performance Analysis</h2>

        <div className="topic-performance">
          <h3>Topic-wise Performance</h3>
          <div className="topics-list">
            {Object.entries(result.topicPerformance).map(([topic, perf]) => (
              <div key={topic} className="topic-item">
                <div className="topic-header">
                  <span className="topic-name">{topic}</span>
                  <span className="topic-score">{perf.correct}/{perf.total}</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${perf.percentage}%`,
                      backgroundColor: getPercentageColor(perf.percentage),
                    }}
                  ></div>
                </div>
                <span className="topic-percentage">{perf.percentage.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="strong-weak-topics">
          <div className="topics-card strong">
            <h3>Strong Topics ✓</h3>
            <ul>
              {result.strongTopics.length > 0 ? (
                result.strongTopics.map((topic, idx) => (
                  <li key={idx}>{topic}</li>
                ))
              ) : (
                <li>No strong topics yet</li>
              )}
            </ul>
          </div>

          <div className="topics-card weak">
            <h3>Topics for Improvement</h3>
            <ul>
              {result.weakTopics.length > 0 ? (
                result.weakTopics.map((topic, idx) => (
                  <li key={idx}>{topic}</li>
                ))
              ) : (
                <li>Great job! All topics are strong</li>
              )}
            </ul>
          </div>
        </div>

        {result.analysis && (
          <div className="insights-section">
            <h3>AI-Generated Insights</h3>

            {result.analysis.strengths && result.analysis.strengths.length > 0 && (
              <div className="insight-card">
                <h4>Key Strengths</h4>
                <ul>
                  {result.analysis.strengths.map((strength, idx) => (
                    <li key={idx}>{strength}</li>
                  ))}
                </ul>
              </div>
            )}

            {result.analysis.improvements && result.analysis.improvements.length > 0 && (
              <div className="insight-card">
                <h4>Areas for Improvement</h4>
                <ul>
                  {result.analysis.improvements.map((improvement, idx) => (
                    <li key={idx}>{improvement}</li>
                  ))}
                </ul>
              </div>
            )}

            {result.analysis.recommendations && result.analysis.recommendations.length > 0 && (
              <div className="insight-card recommendations">
                <h4>Personalized Recommendations</h4>
                <ul>
                  {result.analysis.recommendations.map((rec, idx) => (
                    <li key={idx}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default TestResults;
