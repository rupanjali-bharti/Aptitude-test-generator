import React, { useState } from 'react';
import { generateTests } from '../utils/api';
import '../styles/Home.css';

function Home() {
  const [company, setCompany] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      const response = await generateTests(company, jobDescription);
      setSuccessMessage(`Successfully generated ${response.data.data.length} tests for ${company}!`);
      setCompany('');
      setJobDescription('');
      
      // Redirect to company tests page after short delay
      setTimeout(() => {
        window.location.href = `/tests/${company}`;
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error generating tests. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <h1>Aptitude Test Generator</h1>
        <p className="subtitle">Generate customized aptitude tests for your dream company</p>

        <form onSubmit={handleSubmit} className="test-form">
          <div className="form-group">
            <label htmlFor="company">Company Name *</label>
            <input
              type="text"
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g., Google, Microsoft, Amazon"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="jobDescription">Job Description *</label>
            <textarea
              id="jobDescription"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              rows="8"
              required
              disabled={loading}
            />
          </div>

          {error && <div className="error-message">{error}</div>}
          {successMessage && <div className="success-message">{successMessage}</div>}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Generating Tests...' : 'Generate 6 Tests'}
          </button>
        </form>

        <div className="features">
          <h2>Why Use Our Platform?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>AI-Powered</h3>
              <p>Uses Gemini API to generate questions matching company requirements</p>
            </div>
            <div className="feature-card">
              <h3>Timed Tests</h3>
              <p>Real-world testing experience with accurate timers and progress tracking</p>
            </div>
            <div className="feature-card">
              <h3>Smart Analysis</h3>
              <p>Get detailed analysis of strengths, weaknesses, and improvement areas</p>
            </div>
            <div className="feature-card">
              <h3>Multiple Tests</h3>
              <p>Generate 5-6 different tests per company to practice thoroughly</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
