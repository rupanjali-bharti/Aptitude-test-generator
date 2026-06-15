import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Test from './components/Test';
import TestResults from './components/TestResults';
import ResultsDashboard from './pages/ResultsDashboard';

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
                <Link to="/dashboard" className="nav-link">Dashboard</Link>
              </div>
            </div>
          </nav>
        </header>

        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/test" element={<Test />} />
            <Route path="/results" element={<TestResults />} />
            <Route path="/dashboard" element={<ResultsDashboard />} />
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