import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CanvasEditor from './pages/CanvasEditor';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/canvas/:canvasId" element={<CanvasEditor />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
