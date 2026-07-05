
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStats } from '../utils/api';
import '../styles/Home.css';

const Home = () => {
    
    const [stats, setStats] = useState({ questionsGenerated: 0, testsAvailable: 0, topicsCount: 0 });
    const navigate = useNavigate();

    useEffect(() => {
        const loadStats = async () => {
            try {
                const response = await getStats();
                setStats(response.data || response);
            } catch (error) {
                console.error('Failed to load stats:', error);
            }
        };

        loadStats();
    }, []);

    const handleStartTest = () => {
        // Navigate to the tests list
        navigate('/tests');
    };

    const statCards = [
        { value: `${stats.questionsGenerated.toLocaleString()}`, label: 'Questions Available' },
        { value: `${stats.testsAvailable}`, label: 'Tests Ready' },
        { value: `${stats.topicsCount}`, label: 'Topics Covered' },
        { value: '30 min', label: 'Fixed Session' }
    ];

    return (
        <div className="home-page">
            <section className="hero-section">
                <div className="hero-copy">
                    <div className="hero-pill">Curated aptitude practice</div>
                    <h1>Practice pre-built tests with a fixed 30-minute flow.</h1>
                    <p>Jump into browser-based aptitude tests, answer questions, and review your score instantly without any backend setup.</p>
                    <div className="hero-actions">
                        <button className="btn btn-primary" onClick={handleStartTest}>Start Practicing</button>
                        
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
                    <div className="visual-card analytics-card">🧠 Local test bank</div>
                    <div className="visual-card ai-card">⏱️ Fixed 30-minute sessions</div>
                    <div className="visual-card graph-card">✅ Immediate result review</div>
                </div>
            </section>

            <section className="config-card">
                <h2>Jump straight into practice</h2>
                <p>Pick any ready-made test set and begin a timed session instantly — no setup, no login, no backend needed.</p>
                <div style={{ marginTop: 12 }}>
                    <button className="btn btn-primary wide-btn" onClick={handleStartTest}>View Tests</button>
                </div>
            </section>

            <section className="feature-section">
                <h2>Current Practice Experience</h2>
                <div className="feature-grid">
                    {[
                        ['Ready-made Tests', 'Use curated practice sets built from the project’s local question bank.'],
                        ['Timed Practice', 'Each test runs with a fixed 30-minute countdown for realistic pacing.'],
                        ['Instant Scoring', 'See your score and correct answers right after submission.'],
                        ['Topic Coverage', 'Tests group questions by topic so you can focus where it matters.'],
                        ['Local Browser Flow', 'Everything works in the browser with JSON-backed tests.'],
                        ['Review and Retry', 'Retake attempted tests anytime and track your progress.']
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
                <h2>How This App Works</h2>
                <div className="steps-grid">
                    {[
                        ['Choose a test', 'Select a ready-made practice set from the list.'],
                        ['Answer questions', 'Click any boxed option to choose your answer.'],
                        ['Submit and review', 'Finish the session and see your score instantly.'],
                        ['Retry or improve', 'Retake tests or focus on topics you missed.']
                    ].map(([title, text]) => (
                        <div key={title} className="step-card">
                            <h3>{title}</h3>
                            <p>{text}</p>
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
