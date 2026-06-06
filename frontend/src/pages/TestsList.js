import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCompanyTests } from '../utils/api';
import Test from '../components/Test';
import TestResults from '../components/TestResults';
import '../styles/TestsList.css';

function TestsList() {
  const { company } = useParams();
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTests();
  }, [company]);

  const fetchTests = async () => {
    try {
      const response = await getCompanyTests(company);
      setTests(response.data.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Error loading tests');
      setLoading(false);
    }
  };

  const handleTestComplete = (result) => {
    setTestResult(result);
    setSelectedTest(null);
  };

  if (loading) {
    return <div className="loading">Loading tests...</div>;
  }

  if (testResult) {
    return (
      <div className="tests-list-container">
        <TestResults result={testResult} onBackClick={() => setTestResult(null)} />
      </div>
    );
  }

  if (selectedTest) {
    return (
      <div className="tests-list-container">
        <button className="btn btn-secondary" onClick={() => setSelectedTest(null)}>
          ← Back to Tests
        </button>
        <Test test={selectedTest} onTestComplete={handleTestComplete} />
      </div>
    );
  }

  return (
    <div className="tests-list-container">
      <div className="tests-header">
        <h1>Aptitude Tests for {company}</h1>
        <p>{tests.length} tests available</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {tests.length === 0 ? (
        <div className="no-tests">
          <p>No tests found. Generate tests first!</p>
        </div>
      ) : (
        <div className="tests-grid">
          {tests.map((test, index) => (
            <div key={test._id} className="test-card">
              <h3>Test {index + 1}</h3>
              <div className="test-info">
                <p><strong>Questions:</strong> {test.totalQuestions}</p>
                <p><strong>Duration:</strong> {Math.floor(test.totalDuration / 60)} minutes</p>
                <p><strong>Topics:</strong> {test.topics.join(', ')}</p>
              </div>
              <button
                className="btn btn-primary"
                onClick={() => setSelectedTest(test)}
              >
                Start Test
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TestsList;
