import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/TestResults.css';

// Safely gets the index whether options is an Array or an Object
const getOptionIndex = (options, answer) => {
    if (!options || answer == null) return -1;
    if (Array.isArray(options)) return options.indexOf(answer);
    
    if (typeof options === 'object') {
        const keyIndex = Object.keys(options).indexOf(String(answer));
        if (keyIndex !== -1) return keyIndex;
        return Object.values(options).indexOf(answer);
    }
    return -1;
};

// SUPERCHARGED HELPER: Immune to spaces, prefixes, and formatting differences
const isMatch = (optionVal, correctVal, optIndex) => {
    if (!optionVal || !correctVal) return false;
    
    const optStr = String(optionVal).trim();
    const corrStr = String(correctVal).trim();
    
    if (optStr === corrStr) return true;
    
    const cleanOpt = optStr.replace(/^[A-Ea-e][.)-]\s*/, '').replace(/\s+/g, '').toLowerCase();
    const cleanCorr = corrStr.replace(/^[A-Ea-e][.)-]\s*/, '').replace(/\s+/g, '').toLowerCase();
    
    if (cleanOpt === cleanCorr) return true;
    
    const letters = ['a', 'b', 'c', 'd', 'e'];
    if (letters.includes(corrStr.toLowerCase()) && optIndex !== undefined && optIndex !== -1) {
        return letters.indexOf(corrStr.toLowerCase()) === optIndex;
    }
    
    if (cleanOpt.length > 0 && cleanCorr.includes(cleanOpt)) return true;
    if (cleanCorr.length > 0 && cleanOpt.includes(cleanCorr)) return true;
    
    return false;
};

const TestResults = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const { score, total, answers, questions, questionCount } = location.state || {};

    const { strongTopics, weakTopics } = useMemo(() => {
        if (!questions || !answers) return { strongTopics: [], weakTopics: [] };

        const stats = {};
        questions.forEach((q) => {
            const topicName = q.topic || 'General';
            if (!stats[topicName]) {
                stats[topicName] = { total: 0, correct: 0 };
            }
            stats[topicName].total += 1;
            
            const userOptIndex = getOptionIndex(q.options, answers[q._id]);
            if (isMatch(answers[q._id], q.correctAnswer, userOptIndex) || answers[q._id] === q.options?.[q.correctAnswer]) {
                stats[topicName].correct += 1;
            }
        });

        const strong = [];
        const weak = [];
        Object.entries(stats).forEach(([topic, data]) => {
            const accuracy = Math.round((data.correct / data.total) * 100);
            const formattedTopic = topic.replace(/_/g, ' ').toUpperCase();
            if (accuracy >= 60) strong.push({ name: formattedTopic, accuracy, ...data });
            else weak.push({ name: formattedTopic, accuracy, ...data });
        });

        return { strongTopics: strong, weakTopics: weak };
    }, [questions, answers]);

    if (!questions) {
        return (
            <div className="results-container">
                <h2>No test data found!</h2>
                <button className="btn btn-primary" onClick={() => navigate('/')}>Return Home</button>
            </div>
        );
    }

    const safeTotal = total || questionCount || questions.length || 1;
    const percentage = ((score / safeTotal) * 100).toFixed(1);

    return (
        <div className="test-results-container">
            <div className="results-header">
                <h1>Test Complete!</h1>
                <div className="score-summary">
                    <div className="score-box">
                        <span className="score-number">{score} / {safeTotal}</span>
                        <span className="score-label">Final Score</span>
                    </div>
                    <div className="score-box">
                        <span className="score-number">{percentage}%</span>
                        <span className="score-label">Accuracy</span>
                    </div>
                </div>
                <div className="results-actions" style={{ marginTop: '20px' }}>
                    <button className="btn btn-primary" onClick={() => navigate('/tests')}>View Tests</button>
                    <button className="btn btn-secondary" onClick={() => navigate('/')}>Take Another Test</button>
                </div>
            </div>

            <div className="topic-analysis-section">
                <h2>Topic Analysis</h2>
                <div className="analysis-grid">
                    <div className="analysis-card strong">
                        <h3>💪 Strong Areas</h3>
                        {strongTopics.length > 0 ? (
                            <ul className="topic-list">
                                {strongTopics.map((t, idx) => (
                                    <li key={idx}>
                                        <span className="topic-name">{t.name}</span>
                                        <span className="topic-stat">{t.accuracy}% ({t.correct}/{t.total})</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="small-muted">No strong topics in this test. Keep practicing!</p>
                        )}
                    </div>
                    <div className="analysis-card weak">
                        <h3>⚠️ Needs Improvement</h3>
                        {weakTopics.length > 0 ? (
                            <ul className="topic-list">
                                {weakTopics.map((t, idx) => (
                                    <li key={idx}>
                                        <span className="topic-name">{t.name}</span>
                                        <span className="topic-stat">{t.accuracy}% ({t.correct}/{t.total})</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="small-muted">Great job! No weak areas detected.</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="detailed-review">
                <h2>Detailed Review</h2>
                {questions.map((q, index) => {
                    const userAnswer = answers[q._id];
                    const userOptIndex = getOptionIndex(q.options, userAnswer);
                    const isCorrect = isMatch(userAnswer, q.correctAnswer, userOptIndex);

                    return (
                        <div key={q._id} className={`review-card ${isCorrect ? 'correct-card' : 'wrong-card'}`}>
                            <p><strong>{index + 1}. ({q.topic?.replace(/_/g, ' ').toUpperCase() || 'GENERAL'})</strong> {q.text || q.question}</p>
                            
                            <div className="review-options">
                                {q.options && !Array.isArray(q.options) ? (
                                    Object.keys(q.options).map((key, idx) => {
                                        const optionText = q.options[key];
                                        let optionClass = 'review-option';
                                        
                                        const isCurrentCorrect = isMatch(optionText, q.correctAnswer, idx) || isMatch(key, q.correctAnswer, idx);
                                        const isUserSelection = optionText === userAnswer || key === String(userAnswer);

                                        if (isCurrentCorrect) optionClass += ' correct-option';
                                        else if (isUserSelection && !isCorrect) optionClass += ' wrong-option';

                                        return (
                                            <div key={key} className={optionClass}>
                                                <strong>{key.toUpperCase()}.</strong> {optionText}
                                            </div>
                                        );
                                    })
                                ) : (
                                    (q.options || []).map((optionText, optIndex) => {
                                        let optionClass = 'review-option';
                                        const isThisOptionCorrect = isMatch(optionText, q.correctAnswer, optIndex);
                                        const isThisOptionUserChoice = optionText === userAnswer;

                                        if (isThisOptionCorrect) optionClass += ' correct-option';
                                        else if (isThisOptionUserChoice && !isCorrect) optionClass += ' wrong-option';

                                        return <div key={optIndex} className={optionClass}>{optionText}</div>;
                                    })
                                )}
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