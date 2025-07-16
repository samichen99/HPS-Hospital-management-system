import "./index.css";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './app.jsx'
import React from 'react';


createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
