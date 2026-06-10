import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
    const [level, setLevel] = useState('Medium');
    const [duration, setDuration] = useState(30); // Default to 30 minutes
    const navigate = useNavigate();

    const handleStartTest = () => {
        // Navigate to the test route and pass the configuration in state
        navigate('/test', { state: { level, duration } });
    };

    return (
        <div className="home-container">
            <h1>Aptitude Test Generator</h1>
            <p>Customize your practice session.</p>

            <div className="config-card">
                <div className="form-group">
                    <label>Select Difficulty Level:</label>
                    <select value={level} onChange={(e) => setLevel(e.target.value)}>
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                        <option value="Mixed">Mixed (All Levels)</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Select Time Limit (Minutes):</label>
                    <select value={duration} onChange={(e) => setDuration(Number(e.target.value))}>
                        <option value={15}>15 Minutes</option>
                        <option value={30}>30 Minutes</option>
                        <option value={45}>45 Minutes</option>
                        <option value={60}>60 Minutes</option>
                    </select>
                </div>

                <button className="start-btn" onClick={handleStartTest}>
                    Start Test
                </button>
            </div>
        </div>
    );
};

export default Home;