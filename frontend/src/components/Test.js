import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { submitTestResults } from '../utils/api';
import '../styles/Test.css';

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
    
    // Removes options letters (A., B), etc.) AND entirely removes all spaces for math/ratio immunity
    const cleanOpt = optStr.replace(/^[A-Ea-e][\.\)\-]\s*/, '').replace(/\s+/g, '').toLowerCase();
    const cleanCorr = corrStr.replace(/^[A-Ea-e][\.\)\-]\s*/, '').replace(/\s+/g, '').toLowerCase();
    
    if (cleanOpt === cleanCorr) return true;
    
    const letters = ['a', 'b', 'c', 'd', 'e'];
    if (letters.includes(corrStr.toLowerCase()) && optIndex !== undefined && optIndex !== -1) {
        return letters.indexOf(corrStr.toLowerCase()) === optIndex;
    }

    if (cleanOpt.length > 0 && cleanCorr.includes(cleanOpt)) return true;
    if (cleanCorr.length > 0 && cleanOpt.includes(cleanCorr)) return true;
    
    return false;
};

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
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const submitLock = useRef(false); 

    const handleSubmit = useCallback(async () => {
        if (submitLock.current) return; 
        submitLock.current = true; 
        setIsSubmitting(true);

        let score = 0;
        questions.forEach(q => {
            const userOptIndex = getOptionIndex(q.options, answers[q._id]);
            if (isMatch(answers[q._id], q.correctAnswer, userOptIndex)) {
                score += 1;
            }
        });

        const timeTaken = (duration * 60) - timeLeft;
        const userId = 'demo-user';

        try {
            const response = await submitTestResults(userId, 'generated_test_id', answers, score, timeTaken, questions, level, questionCount, duration);
            const analysis = response?.result?.analysis || {};
            navigate('/results', { state: { score, total: questions.length, answers, questions, analysis, level, questionCount, duration, timeTaken } });
        } catch (error) {
            console.error('Failed to submit test:', error);
            submitLock.current = false; 
            setIsSubmitting(false);
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
        if (timeLeft <= 0 && !submitLock.current) {
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
                        <span>Q {currentIndex + 1} of {questions.length}</span>
                        <span>{currentQuestion.topic ? currentQuestion.topic.replace(/_/g, ' ').toUpperCase() : 'General'}</span>
                        <span>{level}</span>
                    </div>
                    
                    <h3>{currentQuestion.question || currentQuestion.text}</h3>
                    
                    <div className="options-group">
                        {currentQuestion?.options && !Array.isArray(currentQuestion.options) ? (
                            Object.entries(currentQuestion.options).map(([key, value]) => (
                                <div key={key} className="option-item">
                                    <input
                                        type="radio"
                                        name={`question-${currentQuestion._id}`}
                                        id={`opt-${key}`}
                                        value={key}
                                        checked={answers[currentQuestion._id] === key || answers[currentQuestion._id] === value}
                                        onChange={() => handleOptionChange(currentQuestion._id, key)}
                                    />
                                    <label htmlFor={`opt-${key}`}>
                                        <strong>{key.toUpperCase()}.</strong> {value}
                                    </label>
                                </div>
                            ))
                        ) : (
                            (currentQuestion?.options || []).map((option, index) => (
                                <div key={index} className="option-item">
                                    <input
                                        type="radio"
                                        name={`question-${currentQuestion._id}`}
                                        id={`opt-${index}`}
                                        value={option}
                                        checked={answers[currentQuestion._id] === option}
                                        onChange={() => handleOptionChange(currentQuestion._id, option)}
                                    />
                                    <label htmlFor={`opt-${index}`}>{option}</label>
                                </div>
                            ))
                        )}
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
                        <button 
                            className="btn btn-success" 
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Test'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Test;