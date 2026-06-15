import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/TestResults.css';

const TestResults = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [savedResult, setSavedResult] = useState(null);

    const { score, total, answers, questions, analysis, level, questionCount, duration, timeTaken } = location.state || {};

    useEffect(() => {
        const persistResult = async () => {
            if (!questions || !answers) return;

            try {
                const response = await fetch('http://localhost:5000/api/tests/submit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: 'demo-user',
                        answers,
                        score,
                        timeTaken,
                        questions,
                        level,
                        questionCount,
                        duration,
                        totalQuestions: total
                    })
                });
                const data = await response.json();
                if (data.result) {
                    setSavedResult(data.result);
                }
            } catch (error) {
                console.error('Failed to save result:', error);
            }
        };

        persistResult();
    }, [answers, duration, level, questionCount, questions, score, timeTaken, total]);

    if (!questions) {
        return (
            <div className="results-container">
                <h2>No results found.</h2>
                <button className="btn btn-primary" onClick={() => navigate('/')}>Back to Home</button>
            </div>
        );
    }

    const percentage = ((score / total) * 100).toFixed(1);
    const topicPerformance = analysis?.topicPerformance || [];
    const recommendations = analysis?.recommendations || [];
    const summary = analysis?.summary || 'You completed the assessment.';

    return (
        <div className="results-container">
            <div className="results-header">
                <h1>Test Complete!</h1>
                <div className="score-circle">
                    <div className="score-value">{score}/{total}</div>
                    <div className="score-label">{percentage}%</div>
                </div>
                <p className="results-subtitle">{summary}</p>
                <div className="results-actions">
                    <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>View Dashboard</button>
                    <button className="btn btn-secondary" onClick={() => navigate('/')}>Take Another Test</button>
                </div>
            </div>

            <div className="results-summary">
                <div className="summary-card">
                    <h3>Difficulty</h3>
                    <p className="summary-value">{level}</p>
                </div>
                <div className="summary-card">
                    <h3>Questions</h3>
                    <p className="summary-value">{questionCount || total}</p>
                </div>
                <div className="summary-card">
                    <h3>Time Taken</h3>
                    <p className="summary-value">{Math.round((timeTaken || 0) / 60)}m</p>
                </div>
            </div>

            <div className="analysis-section">
                <h2>Performance Breakdown</h2>
                <div className="topic-performance">
                    <h3>Topic Accuracy</h3>
                    <div className="topics-list">
                        {topicPerformance.map((topic) => (
                            <div key={topic.topic} className="topic-item">
                                <div className="topic-header">
                                    <span className="topic-name">{topic.topic}</span>
                                    <span className="topic-score">{topic.accuracy}%</span>
                                </div>
                                <div className="progress-bar"><div className="progress-fill" style={{ width: `${topic.accuracy}%` }} /></div>
                                <div className="topic-percentage">{topic.correct}/{topic.total} correct</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="strong-weak-topics">
                    <div className="topics-card strong">
                        <h3>Strong Topics</h3>
                        <ul>
                            {(analysis?.strongTopics || []).length > 0 ? analysis.strongTopics.map((topic) => <li key={topic}>{topic}</li>) : <li>Keep practicing consistently.</li>}
                        </ul>
                    </div>
                    <div className="topics-card weak">
                        <h3>Needs Attention</h3>
                        <ul>
                            {(analysis?.weakTopics || []).length > 0 ? analysis.weakTopics.map((topic) => <li key={topic}>{topic}</li>) : <li>No weak topics detected.</li>}
                        </ul>
                    </div>
                </div>

                <div className="insights-section">
                    <h3>Insights & Recommendations</h3>
                    {recommendations.map((item, index) => (
                        <div key={index} className="insight-card">
                            <p>{item}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="review-section">
                <h3>Review Your Answers</h3>
                {questions.map((q, index) => {
                    const userAnswer = answers[q._id];
                    const isCorrect = userAnswer === q.correctAnswer;

                    return (
                        <div key={q._id} className={`review-card ${isCorrect ? 'correct-card' : 'wrong-card'}`}>
                            <p><strong>{index + 1}. ({q.topic})</strong> {q.text || q.question}</p>
                            <div className="review-options">
                                {(q.options || []).map((optionText, optIndex) => {
                                    let optionClass = 'review-option';
                                    if (optionText === q.correctAnswer) optionClass += ' correct-option';
                                    else if (optionText === userAnswer && !isCorrect) optionClass += ' wrong-option';
                                    return <div key={optIndex} className={optionClass}>{optionText}</div>;
                                })}
                            </div>
                            {!isCorrect && (
                                <div className="explanation-box">
                                    <h4>Explanation</h4>
                                    <p>{q.explanation || 'No explanation provided.'}</p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TestResults;