import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { submitTestResults } from '../utils/api';
import '../styles/Test.css';

const Test = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { level, duration, questionCount } = location.state || { level: 'Medium', duration: 30, questionCount: 20 };

    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [reviewed, setReviewed] = useState({});
    const [currentIndex, setCurrentIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(duration * 60);
    const [isLoading, setIsLoading] = useState(true);

    const handleSubmit = useCallback(async () => {
        let score = 0;
        questions.forEach(q => {
            if (answers[q._id] === q.correctAnswer) score += 1;
        });

        const timeTaken = (duration * 60) - timeLeft;
        const userId = 'demo-user';

        try {
            const response = await submitTestResults(userId, 'generated_test_id', answers, score, timeTaken, questions, level, questionCount, duration);
            const analysis = response?.result?.analysis || {};
            navigate('/results', { state: { score, total: questions.length, answers, questions, analysis, level, questionCount, duration, timeTaken } });
        } catch (error) {
            console.error('Failed to submit test:', error);
        }
    }, [answers, duration, level, navigate, questionCount, questions, timeLeft]);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await axios.post('http://localhost:5000/api/tests/generate', { level, duration, questionCount });
                setQuestions(response.data.questions);
                setIsLoading(false);
            } catch (error) {
                console.error('Failed to load test:', error);
                setIsLoading(false);
            }
        };
        fetchQuestions();
    }, [level, duration, questionCount]);

    useEffect(() => {
        if (timeLeft <= 0) {
            handleSubmit();
            return;
        }
        const timerId = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        return () => clearInterval(timerId);
    }, [timeLeft, handleSubmit]);

    const handleOptionChange = (questionId, optionKey) => {
        setAnswers(prev => ({ ...prev, [questionId]: optionKey }));
    };

    const toggleReview = (questionId) => {
        setReviewed(prev => ({ ...prev, [questionId]: !prev[questionId] }));
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    if (isLoading) return <div className="loading">Preparing your AI-generated placement test...</div>;
    if (!questions.length) return <div className="loading">No questions available for this configuration.</div>;

    const currentQuestion = questions[currentIndex];
    const progressPercent = ((currentIndex + 1) / questions.length) * 100;

    return (
        <div className="test-container">
            <div className="test-topbar">
                <div>
                    <div className="test-title">{level} Placement Test</div>
                    <div className="test-subtitle">{questionCount} questions • {duration} minutes</div>
                </div>
                <div className={`timer ${timeLeft < 60 ? 'warning' : ''}`}>⏱ {formatTime(timeLeft)}</div>
            </div>

            <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
            </div>

            <div className="test-layout">
                <div className="question-card">
                    <div className="question-meta">
                        <span>Q {currentIndex + 1}</span>
                        <span>{currentQuestion.topic}</span>
                        <span>{level}</span>
                    </div>
                    <h3>{currentQuestion.text}</h3>
                    <div className="options">
                        {(currentQuestion.options || []).map((optionText, optIndex) => (
                            <label key={optIndex} className="option-label">
                                <input
                                    type="radio"
                                    name={currentQuestion._id}
                                    value={optionText}
                                    checked={answers[currentQuestion._id] === optionText}
                                    onChange={() => handleOptionChange(currentQuestion._id, optionText)}
                                />
                                <span>{optionText}</span>
                            </label>
                        ))}
                    </div>
                    <div className="action-row">
                        <button className="btn btn-secondary" onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))} disabled={currentIndex === 0}>Previous</button>
                        <button className="btn btn-secondary" onClick={() => toggleReview(currentQuestion._id)}>{reviewed[currentQuestion._id] ? 'Unmark Review' : 'Mark Review'}</button>
                        <button className="btn btn-primary" onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}>Next</button>
                    </div>
                </div>

                <div className="sidebar-card">
                    <h4>Question Navigator</h4>
                    <div className="question-grid">
                        {questions.map((q, index) => {
                            const stateClass = answers[q._id] ? 'answered' : reviewed[q._id] ? 'review' : '';
                            return (
                                <button key={q._id} className={`question-number ${currentIndex === index ? 'active' : ''} ${stateClass}`} onClick={() => setCurrentIndex(index)}>
                                    {index + 1}
                                </button>
                            );
                        })}
                    </div>
                    <div className="action-row">
                        <button className="btn btn-success" onClick={handleSubmit}>Submit Test</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Test;