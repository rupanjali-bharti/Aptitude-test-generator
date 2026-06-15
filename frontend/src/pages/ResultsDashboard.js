import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ResultsDashboard.css';

const ResultsDashboard = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/tests/results');
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error('Failed to load dashboard results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  if (loading) return <div className="loading">Loading your performance dashboard...</div>;

  const latest = results[0] || null;
  const previous = results[1] || null;

  const latestScore = latest?.score != null ? Number(latest.score) : null;
  const latestTotal = latest?.totalQuestions != null ? Number(latest.totalQuestions) : null;
  const latestPercentage = latest?.percentage != null ? Number(latest.percentage) : null;
  const previousPercentage = previous?.percentage != null ? Number(previous.percentage) : null;
  const trendDelta = previousPercentage != null && latestPercentage != null ? Number((latestPercentage - previousPercentage).toFixed(1)) : null;

  const questionResults = Array.isArray(latest?.questionResults) ? latest.questionResults : [];
  const totalQuestions = latestTotal != null ? latestTotal : questionResults.length;
  const attemptedCount = questionResults.length > 0
    ? questionResults.filter((item) => item?.userAnswer !== undefined && item?.userAnswer !== null && item?.userAnswer !== '').length
    : (totalQuestions != null ? totalQuestions : 0);
  const correctCount = questionResults.length > 0
    ? questionResults.filter((item) => item?.isCorrect).length
    : (latestScore != null ? latestScore : 0);
  const incorrectCount = questionResults.length > 0
    ? questionResults.filter((item) => item?.userAnswer !== undefined && item?.userAnswer !== null && item?.userAnswer !== '' && !item?.isCorrect).length
    : (totalQuestions != null && latestScore != null ? Math.max(totalQuestions - correctCount, 0) : 0);
  const skippedCount = totalQuestions != null ? Math.max(totalQuestions - attemptedCount, 0) : 0;

  const trendSeries = results.slice(0, 10).map((item) => Number(item?.percentage || 0));
  const averageTimePerQuestion = results.length > 0
    ? Number((results.reduce((sum, item) => sum + Number(item?.timeTakenSeconds || 0), 0) / results.reduce((sum, item) => sum + Number(item?.totalQuestions || 0), 0)).toFixed(1))
    : null;
  const latestTimePerQuestion = totalQuestions != null && totalQuestions > 0 ? Number(((latest?.timeTakenSeconds || 0) / totalQuestions).toFixed(1)) : null;
  const readinessScore = latestPercentage != null ? Number(Math.min(latestPercentage, 100).toFixed(1)) : null;

  const topicData = Array.isArray(latest?.analysis?.topicPerformance) ? latest.analysis.topicPerformance.slice(0, 6) : [];
  const topicSummary = topicData.length > 0 ? topicData.map((topic) => ({
    topic: topic.topic || 'General',
    accuracy: Number(topic.accuracy || 0),
    avgTime: totalQuestions > 0 ? Math.round((latest?.timeTakenSeconds || 0) / Math.max(topic.total || 1, 1)) : 0
  })) : [];

  const sortedTopics = [...topicSummary].sort((a, b) => (a.avgTime || 0) - (b.avgTime || 0));
  const fastestTopic = sortedTopics[0] || null;
  const slowestTopic = sortedTopics[sortedTopics.length - 1] || null;
  const percentileRank = results.length > 0 && latestPercentage != null
    ? Math.min(100, Math.max(0, Math.round((results.filter((item) => (item?.percentage || 0) < latestPercentage).length / results.length) * 100)))
    : null;

  const getTopicStatus = (accuracy) => {
    if (accuracy >= 75) return { label: 'Strong', className: 'strong' };
    if (accuracy >= 60) return { label: 'Needs Improvement', className: 'improve' };
    return { label: 'Weak', className: 'weak' };
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-shell">
        <section className="dashboard-hero">
          <div className="dashboard-hero-top">
            <div>
              <h1>Previous Test Performance Dashboard</h1>
              <p className="dashboard-subtitle">
                A professional view of your most recent aptitude test with key metrics, topic trends, and action-oriented insights.
              </p>
            </div>
            <button className="btn btn-primary" onClick={() => navigate('/')}>Start New Test</button>
          </div>

          <div className="dashboard-meta">
            <div className="meta-pill">
              <span>Test Name</span>
              <strong>{latest ? `Aptitude Test ${new Date(latest.createdAt).toLocaleDateString()}` : 'No test yet'}</strong>
            </div>
            <div className="meta-pill">
              <span>Date & Time</span>
              <strong>{latest ? new Date(latest.createdAt).toLocaleString() : '—'}</strong>
            </div>
            <div className="meta-pill">
              <span>Duration</span>
              <strong>{latest ? `${Math.round((latest.timeTakenSeconds || 0) / 60)} mins` : '—'}</strong>
            </div>
            <div className="meta-pill">
              <span>Difficulty</span>
              <strong>{latest?.level || '—'}</strong>
            </div>
            <div className="meta-pill">
              <span>Overall Score</span>
              <strong>{latestScore != null && latestTotal != null ? `${latestScore}/${latestTotal}` : '—'}</strong>
            </div>
            <div className="meta-pill">
              <span>Accuracy</span>
              <strong>{latestPercentage != null ? `${latestPercentage}%` : '—'}</strong>
            </div>
            <div className="meta-pill">
              <span>Percentile Rank</span>
              <strong>{percentileRank != null ? `${percentileRank}%` : '—'}</strong>
            </div>
          </div>
        </section>

        <section className="kpi-grid">
          <div className="kpi-card">
            <strong>{latestScore != null && latestTotal != null ? `${latestScore}/${latestTotal}` : '—'}</strong>
            <span>Score</span>
            <div className={`trend ${trendDelta != null && trendDelta >= 0 ? 'trend-up' : 'trend-down'}`}>{trendDelta != null ? (trendDelta >= 0 ? `↑ ${trendDelta}%` : `↓ ${Math.abs(trendDelta)}%`) : 'No comparison yet'} vs previous</div>
          </div>
          <div className="kpi-card">
            <strong>{latestPercentage != null ? `${latestPercentage}%` : '—'}</strong>
            <span>Accuracy</span>
            <div className={`trend ${latestPercentage != null ? 'trend-up' : 'trend-down'}`}>{latestPercentage != null ? 'Latest recorded result' : 'No result available'}</div>
          </div>
          <div className="kpi-card">
            <strong>{latestTimePerQuestion != null ? `${latestTimePerQuestion} sec` : '—'}</strong>
            <span>Avg. time / question</span>
            <div className="trend trend-up">{averageTimePerQuestion != null ? `Average across attempts: ${averageTimePerQuestion} sec` : 'No timing data yet'}</div>
          </div>
          <div className="kpi-card">
            <strong>{readinessScore != null ? `${readinessScore}%` : '—'}</strong>
            <span>Readiness score</span>
            <div className={`trend ${readinessScore != null ? 'trend-up' : 'trend-down'}`}>{readinessScore != null ? 'Based on latest accuracy' : 'No result available'}</div>
          </div>
        </section>

        <div className="dashboard-grid">
          <section className="panel">
            <div className="panel-header">
              <h3>Accuracy Trend</h3>
              <span className="metric-chip">Last 10 tests</span>
            </div>
            <div className="bar-chart" style={{ height: '220px' }}>
              {trendSeries.length > 0 ? trendSeries.map((value, index) => (
                <div key={`${value}-${index}`} className="bar-card">
                  <div className="bar-track">
                    <div className="bar-fill attempted" style={{ height: `${Math.max(value, 0)}%` }} />
                  </div>
                  <strong>{value}%</strong>
                  <span>Test {index + 1}</span>
                </div>
              )) : (
                <div className="bar-card">
                  <div className="bar-track">
                    <div className="bar-fill attempted" style={{ height: '0%' }} />
                  </div>
                  <strong>—</strong>
                  <span>No result available</span>
                </div>
              )}
            </div>
            <div className="chart-legend">
              <span className="legend-item"><span className="legend-dot" style={{ background: '#2563eb' }} /> Accuracy trend</span>
              <span className="legend-item"><span className="legend-dot" style={{ background: '#16a34a' }} /> Best result highlighted</span>
            </div>
          </section>

          <section className="panel">
            <div className="panel-header">
              <h3>Questions Solved Analysis</h3>
              <span className="metric-chip">{latestTotal} questions</span>
            </div>
            <div className="bar-chart">
              {[
                { label: 'Attempted', value: attemptedCount, color: 'attempted', percent: totalQuestions > 0 ? `${Math.round((attemptedCount / totalQuestions) * 100)}%` : '—' },
                { label: 'Correct', value: correctCount, color: 'correct', percent: totalQuestions > 0 ? `${Math.round((correctCount / totalQuestions) * 100)}%` : '—' },
                { label: 'Incorrect', value: incorrectCount, color: 'incorrect', percent: totalQuestions > 0 ? `${Math.round((incorrectCount / totalQuestions) * 100)}%` : '—' },
                { label: 'Skipped', value: skippedCount, color: 'skipped', percent: totalQuestions > 0 ? `${Math.round((skippedCount / totalQuestions) * 100)}%` : '—' }
              ].map((item) => (
                <div key={item.label} className="bar-card">
                  <div className="bar-track">
                    <div className={`bar-fill ${item.color}`} style={{ height: `${Math.max((item.value / Math.max(totalQuestions, 1)) * 100, item.value > 0 ? 8 : 0)}%` }} />
                  </div>
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                  <span className="small-muted">{item.percent}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="dashboard-grid">
          <section className="panel">
            <div className="panel-header">
              <h3>Average Time per Question</h3>
              <span className="metric-chip">Based on saved attempts</span>
            </div>
            <div className="bar-chart" style={{ height: '190px' }}>
              {trendSeries.length > 0 ? trendSeries.map((value, index) => (
                <div key={`time-${index}`} className="bar-card">
                  <div className="bar-track">
                    <div className="bar-fill incorrect" style={{ height: `${Math.max(value, 0)}%` }} />
                  </div>
                  <strong>{value}%</strong>
                  <span>Test {index + 1}</span>
                </div>
              )) : (
                <div className="bar-card">
                  <div className="bar-track">
                    <div className="bar-fill incorrect" style={{ height: '0%' }} />
                  </div>
                  <strong>—</strong>
                  <span>No result available</span>
                </div>
              )}
            </div>
            <div className="time-insight">
              {latest && trendDelta != null ? `Your average solving speed changed by ${trendDelta >= 0 ? '+' : ''}${trendDelta}% compared to the previous attempt. Fastest topic: ${fastestTopic?.topic || 'N/A'}. Slowest topic: ${slowestTopic?.topic || 'N/A'}.` : 'No performance insight is available yet for this attempt.'}
            </div>
          </section>

          <section className="panel">
            <div className="panel-header">
              <h3>Topic-wise Strength Analysis</h3>
              <span className="metric-chip">Accuracy • Time • Difficulty</span>
            </div>
            <div className="topic-list">
              {topicSummary.length > 0 ? topicSummary.map((topic) => {
                const status = getTopicStatus(topic.accuracy);
                return (
                  <div key={topic.topic} className="topic-item">
                    <div className="topic-name">
                      <span className={`status-dot ${status.className}`} />
                      <span>{topic.topic}</span>
                    </div>
                    <div className="topic-meta">
                      <div>{topic.accuracy}% accuracy</div>
                      <div>{topic.avgTime || 0} sec avg</div>
                    </div>
                  </div>
                );
              }) : (
                <div className="small-muted">No topic performance data is available yet.</div>
              )}
            </div>
          </section>
        </div>

        <section className="panel">
          <div className="panel-header">
            <h3>Weak Areas Detection</h3>
            <span className="metric-chip">Focus areas</span>
          </div>
          <div className="weak-areas">
            {(latest?.analysis?.weakTopics && latest.analysis.weakTopics.length > 0 ? latest.analysis.weakTopics : []).slice(0, 3).map((topic) => (
              <div key={topic} className="weak-card">
                <strong>{topic}</strong>
                <span>Accuracy is below the recommended benchmark. Review missed concepts and practice similar questions to improve confidence.</span>
              </div>
            ))}
            {(!latest?.analysis?.weakTopics || latest.analysis.weakTopics.length === 0) && (
              <div className="weak-card">
                <strong>No weak topics detected</strong>
                <span>Complete a test to populate this section with topic-level insights.</span>
              </div>
            )}
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <h3>All Attempted Tests</h3>
            <span className="metric-chip">{results.length} attempts</span>
          </div>
          {results.length > 0 ? (
            <div className="history-list">
              {results.map((item, index) => {
                const testNumber = results.length - index;
                return (
                  <div key={item._id} className="history-item">
                    <div>
                      <strong>Aptitude Test {testNumber}</strong>
                      <div className="small-muted">{new Date(item.createdAt).toLocaleDateString()} at {new Date(item.createdAt).toLocaleTimeString()} • {item.level || 'Medium'} • {item.questionCount || item.totalQuestions || 0} questions</div>
                    </div>
                    <div className="history-stats">
                      <span>{item.score || 0}/{item.totalQuestions || 0}</span>
                      <span>{item.percentage != null ? `${item.percentage}% accuracy` : 'Accuracy not available'}</span>
                      <span>{Math.round((item.timeTakenSeconds || 0) / 60)} mins</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="small-muted">No test attempts have been recorded yet.</div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ResultsDashboard;
