import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/TestResults.css';

const TestResults = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    // Catch the data passed from the Test component
    const { score, total, answers, questions } = location.state || {};

    if (!questions) {
        return (
            <div className="results-container">
                <h2>No results found.</h2>
                <button onClick={() => navigate('/')}>Back to Home</button>
            </div>
        );
    }

    const percentage = ((score / total) * 100).toFixed(1);

    return (
        <div className="results-container">
            <div className="score-header">
                <h1>Test Complete!</h1>
                <div className="score-circle">
                    <h2>{score} / {total}</h2>
                    <p>{percentage}%</p>
                </div>
                <button className="home-btn" onClick={() => navigate('/')}>Take Another Test</button>
            </div>

            <div className="review-section">
                <h3>Review Your Answers</h3>
                {questions.map((q, index) => {
                    const userAnswer = answers[q._id];
                    const isCorrect = userAnswer === q.correct_answer;

                    return (
                        <div key={q._id} className={`review-card ${isCorrect ? 'correct-card' : 'wrong-card'}`}>
                            <p><strong>{index + 1}. ({q.topic})</strong> {q.question}</p>
                            
                            <div className="review-options">
                                {Object.entries(q.options).map(([key, value]) => {
                                    let optionClass = "review-option ";
                                    if (key === q.correct_answer) optionClass += "correct-option ";
                                    else if (key === userAnswer && !isCorrect) optionClass += "wrong-option ";

                                    return (
                                        <div key={key} className={optionClass}>
                                            {key.toUpperCase()}: {value}
                                        </div>
                                    );
                                })}
                            </div>

                            {!isCorrect && (
                                <div className="explanation-box">
                                    <h4>Explanation:</h4>
                                    <p>{q.explanation || "No explanation provided."}</p>
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