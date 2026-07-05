import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getTestById, submitAttempt } from '../utils/api';
import '../styles/Test.css';

const USER_ID = 'demo-user';

export default function TestTaking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const durationMinutes = 30;

  const [test, setTest] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);

  const questionStartRef = useRef(Date.now());
  const submitRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getTestById(id, false);
        const testData = res.data || res;
        setTest(testData);
        if (testData?.questions) {
          setAnswers(testData.questions.map((_, idx) => ({ questionIndex: idx, selectedAnswer: null, timeSpentSeconds: 0 })));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  useEffect(() => {
    if (loading || !test) return;

    if (timeLeft <= 0) {
      submitRef.current?.();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, loading, test]);

  useEffect(() => {
    setTimeLeft(durationMinutes * 60);
  }, [durationMinutes]);

  const recordTimeForCurrent = useCallback(() => {
    const now = Date.now();
    const elapsed = Math.round((now - questionStartRef.current) / 1000);
    setAnswers((prev) => {
      const copy = [...prev];
      const entry = copy[currentIndex] || { questionIndex: currentIndex, selectedAnswer: null, timeSpentSeconds: 0 };
      entry.timeSpentSeconds = (entry.timeSpentSeconds || 0) + elapsed;
      copy[currentIndex] = entry;
      return copy;
    });
    questionStartRef.current = Date.now();
  }, [currentIndex]);

  const goToIndex = (idx) => {
    recordTimeForCurrent();
    setCurrentIndex(idx);
  };

  const handleSelect = (idx, value) => {
    setAnswers((prev) => {
      const copy = [...prev];
      const entry = copy[idx] || { questionIndex: idx, selectedAnswer: null, timeSpentSeconds: 0 };
      entry.selectedAnswer = value;
      copy[idx] = entry;
      return copy;
    });
  };

  const handleSubmit = useCallback(async () => {
    recordTimeForCurrent();
    try {
      const payload = { testId: id, userId: USER_ID, durationSelectedSeconds: durationMinutes * 60, answers };
      const res = await submitAttempt(payload);
      const attemptData = res.data?.attempt || res.attempt;
      const fullTest = res.data?.test || test;
      const questionResults = fullTest.questions.map((q, idx) => ({
        index: idx,
        text: q.text,
        options: q.options,
        difficulty: q.difficulty,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        selectedAnswer: answers[idx]?.selectedAnswer || null,
        timeSpentSeconds: answers[idx]?.timeSpentSeconds || 0,
      }));
      navigate('/results', { state: { attempt: attemptData, test: fullTest, questionResults, autoSubmitted: timeLeft <= 0 } });
    } catch (err) {
      console.error('Submit failed', err);
      alert('Failed to submit attempt');
    }
  }, [answers, id, navigate, recordTimeForCurrent, test, timeLeft]);

  useEffect(() => {
    submitRef.current = handleSubmit;
  }, [handleSubmit]);

  if (loading) return <div className="loading">Loading test...</div>;
  if (!test) return <div className="loading">Test not found</div>;

  const q = test.questions[currentIndex];
  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const seconds = (timeLeft % 60).toString().padStart(2, '0');
  const progress = Math.round(((durationMinutes * 60 - timeLeft) / (durationMinutes * 60)) * 100);

  return (
    <div className="test-container">
      <div className="test-topbar">
        <div>
          <div className="test-title">{test.title}</div>
          <div className="test-subtitle">{test.totalQuestions} questions • 30 minutes</div>
        </div>
        <div className={`timer ${timeLeft <= 60 ? 'warning' : ''}`}>{minutes}:{seconds}</div>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="test-layout">
        <div className="question-card">
          <div className="question-meta">
            <span>Q {currentIndex + 1} of {test.questions.length}</span>
            <span>{q.difficulty}</span>
          </div>

          <h3>{q.text}</h3>

          <div className="options-group">
            {(q.options || []).map((opt, idx) => (
              <label key={idx} className="option-item" htmlFor={`opt-${idx}`}>
                <input
                  type="radio"
                  name={`q-${currentIndex}`}
                  id={`opt-${idx}`}
                  checked={answers[currentIndex]?.selectedAnswer === opt.key}
                  onChange={() => handleSelect(currentIndex, opt.key)}
                />
                <span>{`${opt.key}. ${opt.text}`}</span>
              </label>
            ))}
          </div>

          <div className="action-row">
            <button className="btn btn-secondary" onClick={() => goToIndex(Math.max(0, currentIndex - 1))} disabled={currentIndex === 0}>Previous</button>
            <button className="btn btn-primary" onClick={() => goToIndex(Math.min(test.questions.length - 1, currentIndex + 1))}>Next</button>
          </div>
        </div>

        <div className="sidebar-card">
          <h4>Question Navigator</h4>
          <div className="question-grid">
            {test.questions.map((_, idx) => (
              <button key={idx} className={`question-number ${currentIndex === idx ? 'active' : ''} ${answers[idx] && answers[idx].selectedAnswer ? 'answered' : ''}`} onClick={() => goToIndex(idx)}>{idx + 1}</button>
            ))}
          </div>
          <div className="action-row">
            <button className="btn btn-success" onClick={handleSubmit}>Submit Test</button>
          </div>
        </div>
      </div>
    </div>
  );
}
