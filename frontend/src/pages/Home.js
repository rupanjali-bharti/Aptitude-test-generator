import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
    const [level, setLevel] = useState('Medium');
    const [duration, setDuration] = useState(30);
    const [questionCount, setQuestionCount] = useState(20);
    const [stats, setStats] = useState({ questionsGenerated: 0, testsAttempted: 0, topicsCount: 0 });
    const navigate = useNavigate();

    useEffect(() => {
        const loadStats = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/tests/stats');
                const data = await response.json();
                setStats(data);
            } catch (error) {
                console.error('Failed to load stats:', error);
            }
        };

        loadStats();
    }, []);

    const handleStartTest = () => {
        navigate('/test', { state: { level, duration, questionCount } });
    };

    const statCards = [
        { value: `${stats.questionsGenerated.toLocaleString()}+`, label: 'Questions' },
        { value: `${stats.topicsCount}+`, label: 'Aptitude Topics' },
        { value: 'Real-Time', label: 'Performance Tracking' },
        { value: 'AI-Powered', label: 'Test Generation' }
    ];

    return (
        <div className="home-page">
            <section className="hero-section">
                <div className="hero-copy">
                    <div className="hero-pill">AI-powered aptitude practice</div>
                    <h1>Master Aptitude. Increase Speed. Improve Accuracy.</h1>
                    <p>Practice thousands of aptitude questions, track your performance, and build the speed needed to crack placement tests with confidence.</p>
                    <div className="hero-actions">
                        <button className="btn btn-primary" onClick={handleStartTest}>Start Practicing</button>
                        <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>Dashboard</button>
                    </div>
                    <div className="hero-stats">
                        {statCards.map((card) => (
                            <div key={card.label} className="hero-stat-card">
                                <strong>{card.value}</strong>
                                <span>{card.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="hero-visual">
                    <div className="visual-card analytics-card">📈 Placement readiness</div>
                    <div className="visual-card ai-card">🤖 AI question generation</div>
                    <div className="visual-card graph-card">📊 Performance trend</div>
                </div>
            </section>

            <section className="config-card">
                <h2>Create Your Custom Practice Session</h2>
                <div className="form-grid">
                    <div className="form-group">
                        <label>Select Difficulty Level</label>
                        <select value={level} onChange={(e) => setLevel(e.target.value)}>
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                            <option value="Mixed">Mixed (All Levels)</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Select Number of Questions</label>
                        <select value={questionCount} onChange={(e) => setQuestionCount(Number(e.target.value))}>
                            <option value={15}>15 Questions</option>
                            <option value={20}>20 Questions</option>
                            <option value={25}>25 Questions</option>
                            <option value={30}>30 Questions</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Select Time Limit (Minutes)</label>
                        <select value={duration} onChange={(e) => setDuration(Number(e.target.value))}>
                            <option value={15}>15 Minutes</option>
                            <option value={20}>20 Minutes</option>
                            <option value={25}>25 Minutes</option>
                            <option value={30}>30 Minutes</option>
                            <option value={40}>40 Minutes</option>
                            <option value={60}>60 Minutes</option>
                        </select>
                    </div>
                </div>
                <button className="btn btn-primary wide-btn" onClick={handleStartTest}>Start Aptitude Test</button>
            </section>

            <section className="feature-section">
                <h2>Everything You Need to Crack Placements</h2>
                <div className="feature-grid">
                    {[
                        ['Topic-wise Practice', 'Sharpen your skills across Quantitative, Logical Reasoning, and Verbal Ability.'],
                        ['Speed Improvement Training', 'Build pace with timed drills and accuracy-focused practice.'],
                        ['Accuracy Analytics', 'Understand where you are gaining or losing marks.'],
                        ['Weakness Detection', 'Get personalized insights into your weakest areas.'],
                        ['Placement Test Simulator', 'Experience realistic mock tests before the real placement round.'],
                        ['AI-Generated Practice Sets', 'Receive fresh question sets tailored to your performance.']
                    ].map(([title, text]) => (
                        <div key={title} className="feature-card">
                            <h3>{title}</h3>
                            <p>{text}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="preview-section">
                <div className="preview-card">
                    <h2>Performance Dashboard Preview</h2>
                    <p>Track accuracy trends, questions solved, average time per question, and topic-wise strength with an intuitive analytics view.</p>
                    <div className="preview-metrics">
                        <div className="mini-card">Accuracy Trend</div>
                        <div className="mini-card">Questions Solved</div>
                        <div className="mini-card">Avg. Time / Q</div>
                        <div className="mini-card">Topic Strength</div>
                    </div>
                </div>
            </section>

            <section className="steps-section">
                <h2>How It Works</h2>
                <div className="steps-grid">
                    {['Choose a Topic', 'Practice Questions', 'Analyze Performance', 'Improve Weak Areas', 'Crack Placement Tests'].map((step, index) => (
                        <div key={step} className="step-card">
                            <span className="step-number">0{index + 1}</span>
                            <h3>{step}</h3>
                        </div>
                    ))}
                </div>
            </section>

            <section className="extra-section">
                <h2>More Ways to Stay on Track</h2>
                <div className="feature-grid">
                    {['Daily Challenges', 'Streak Tracker', 'Leaderboard', 'Company-wise Aptitude Tests', 'Progress Heatmap'].map((item) => (
                        <div key={item} className="feature-card">
                            <h3>{item}</h3>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Home;