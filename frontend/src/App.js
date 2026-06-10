import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Test from './components/Test'; // Assuming Test.js is in src/components/
import TestResults from './components/TestResults'; // Assuming TestResults.js is in src/components/

function App() {
  return (
    <Router>
      <Routes>
        {/* Your existing Home route */}
        <Route path="/" element={<Home />} />
        
        {/* ADD THESE TWO LINES */}
        <Route path="/test" element={<Test />} />
        <Route path="/results" element={<TestResults />} />
      </Routes>
    </Router>
  );
}

export default App;