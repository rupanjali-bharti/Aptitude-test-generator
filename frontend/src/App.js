import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import TestsList from './pages/TestsList';
import TestTaking from './pages/TestTaking';
import ResultsView from './pages/ResultsView';

function App() {
  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <nav className="navbar">
            <div className="nav-container">
              <Link to="/" className="nav-logo">🧠 Aptitude Studio</Link>
              <div className="nav-links">
                <Link to="/" className="nav-link">Home</Link>
                <Link to="/tests" className="nav-link">Tests</Link>
              </div>
            </div>
          </nav>
        </header>

        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tests" element={<TestsList />} />
            <Route path="/tests/take/:id" element={<TestTaking />} />
            <Route path="/results" element={<ResultsView />} />
          </Routes>
        </main>

        <footer className="app-footer">
          <p>Practice smarter with adaptive aptitude tests and detailed performance insights.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;