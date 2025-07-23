import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "c:/Users/hpp/OneDrive/Desktop/HPS Hospital-management-system/frontend/src/pages/home.jsx";
import axios from "axios"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Add more routes later */}
      </Routes>
    </Router>
  );
}

export default App;
