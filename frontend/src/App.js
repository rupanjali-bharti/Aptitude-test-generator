import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import TestsList from './pages/TestsList';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <nav className="navbar">
            <div className="nav-container">
              <a href="/" className="nav-logo">
                📝 Aptitude Test Generator
              </a>
            </div>
          </nav>
        </header>

        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tests/:company" element={<TestsList />} />
          </Routes>
        </main>

        <footer className="app-footer">
          <p>&copy; 2026 Aptitude Test Generator. Powered by Gemini AI.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
