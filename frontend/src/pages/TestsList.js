import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTests } from '../utils/api';
import '../styles/TestsList.css';

const loadAttemptedTests = () => {
  try {
    return JSON.parse(localStorage.getItem('attemptedTests') || '[]');
  } catch {
    return [];
  }
};

const titleCase = (text) => text
  .replace(/[-_]/g, ' ')
  .split(' ')
  .filter(Boolean)
  .map((word) => word[0].toUpperCase() + word.slice(1))
  .join(' ');

function TestsList() {
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [attemptedTests, setAttemptedTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTests();
    setAttemptedTests(loadAttemptedTests());
  }, []);

  const fetchTests = async () => {
    try {
      const res = await getTests();
      setTests(res.data || []);
    } catch (err) {
      console.error(err);
      setError('Failed to load tests');
    } finally {
      setLoading(false);
    }
  };

  const getDisplayTitle = (test, idx) => {
    return `Quantitative Aptitude Challenge ${idx + 1}`;
  };

  const getTopics = (test) => {
    return Array.from(new Set((test.questions || []).map((q) => q.topic).filter(Boolean)));
  };

  const handleClick = (test) => {
    navigate(`/tests/take/${test.id}`);
  };

  if (loading) return <div className="loading">Loading tests...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="tests-list-container">
      <div className="tests-header">
        <h1>Available Tests</h1>
        <p>{tests.length} tests ready to try</p>
      </div>

      <div className="tests-grid">
        {tests.map((test, idx) => {
          const title = getDisplayTitle(test, idx);
          const topics = getTopics(test);
          const isAttempted = attemptedTests.includes(test.id);

          return (
            <div key={test.id} className="test-card">
                  <div className="card-flip">
                <div className="card-face card-front">
                  <div className="card-front-inner">
                    <div className="card-top-row">
                      <h3>{title}</h3>
                      {isAttempted && <span className="attempted-badge">Attempted</span>}
                    </div>
                    <div className="test-info">
                      <p><strong>Questions:</strong> {test.totalQuestions}</p>
                      <p><strong>Duration:</strong> 30 minutes</p>
                    </div>
                  </div>
                  <button className={`btn ${isAttempted ? 'btn-secondary' : 'btn-primary'}`} onClick={() => handleClick(test)}>
                    {isAttempted ? 'Retake Test' : 'Start Test'}
                  </button>
                </div>

                <div className="card-face card-back">
                  <div className="back-card-inner">
                    <div className="overlay-title">Topics included</div>
                    <div className="overlay-topic-list">
                      {topics.length > 0 ? (
                        topics.slice(0, 20).map((topic) => (
                          <span key={topic} className="topic-neon">{topic}</span>
                        ))
                      ) : (
                        <span className="topic-neon">General</span>
                      )}
                      {topics.length > 20 && (
                        <span className="topic-more">+{topics.length - 20} more</span>
                      )}
                    </div>
                  </div>
                  <button className="btn btn-primary" onClick={() => handleClick(test)}>
                    Open Test
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TestsList;
