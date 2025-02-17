import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProblemPage from './pages/ProblemPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/problem/:id" element={<ProblemPage />} />
      </Routes>
    </Router>
  );
}

export default App;