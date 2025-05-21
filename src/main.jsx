import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { JobProvider } from './contexts/JobContext';
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
      <JobProvider>
        <App />
      </JobProvider>
)