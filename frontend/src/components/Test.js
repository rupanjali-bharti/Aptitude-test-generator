import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios'; // <--- ADD THIS
import { submitTestResults } from '../utils/api';
import '../styles/Test.css';

const Test = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { level, duration } = location.state || { level: 'Medium', duration: 30 };

    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(duration * 60);
    const [isLoading, setIsLoading] = useState(true);

    // 1. Submit the Test (Stabilized)
    const handleSubmit = useCallback(async () => {
        let score = 0;
        questions.forEach(q => {
            if (answers[q._id] === q.correct_answer) score += 1;
        });

        const timeTaken = (duration * 60) - timeLeft;
        const userId = "placeholder_user_id"; 
        
        try {
            await submitTestResults(userId, "generated_test_id", answers, score, timeTaken);
            navigate('/results', { state: { score, total: questions.length, answers, questions } });
        } catch (error) {
            console.error("Failed to submit test:", error);
        }
    }, [answers, duration, navigate, questions, timeLeft]); 

    // 2. Fetch Questions on Load
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await axios.post('http://localhost:5000/api/tests/generate', { 
                    level, 
                    duration 
                });
                setQuestions(response.data.questions);
                setIsLoading(false);
            } catch (error) {
                console.error("Failed to load test:", error);
                setIsLoading(false);
            }
        };
        fetchQuestions();
    }, [level, duration]);

    // 3. Handle the Countdown Timer
    useEffect(() => {
        if (timeLeft <= 0) {
            handleSubmit();
            return;
        }
        const timerId = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        return () => clearInterval(timerId);
    }, [timeLeft, handleSubmit]); // Now it only runs when timeLeft or handleSubmit changes

    const handleOptionChange = (questionId, optionKey) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: optionKey
        }));
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    if (isLoading) return <div>Generating your test...</div>;

    return (
        <div className="test-container">
            <div className="test-header">
                <h2>{level} Aptitude Test</h2>
                <div className={`timer ${timeLeft < 60 ? 'warning' : ''}`}>
                    Time Left: {formatTime(timeLeft)}
                </div>
            </div>

            <div className="questions-list">
                {questions.map((q, index) => (
                    <div key={q._id} className="question-card">
                        {/* 1. Changed q.question to q.text */}
                        <p><strong>{index + 1}. ({q.topic})</strong> {q.text}</p>
                        
                        <div className="options">
                            {/* 2. Changed options mapping to handle an array instead of an object */}
                            {q.options.map((optionText, optIndex) => (
                                <label key={optIndex} className="option-label">
                                    <input 
                                        type="radio" 
                                        name={q._id} 
                                        value={optionText}
                                        checked={answers[q._id] === optionText}
                                        onChange={() => handleOptionChange(q._id, optionText)}
                                    />
                                    {optionText}
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <button className="submit-btn" onClick={handleSubmit}>
                Submit Test
            </button>
        </div>
    );
};

export default Test;