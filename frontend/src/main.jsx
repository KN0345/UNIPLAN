import React from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'
import './uniplan-final-fix.css'
import App from './App.jsx'

window.addEventListener('error', (event) => {
  console.error('UniPlan runtime error:', event.error || event.message)
})
window.addEventListener('unhandledrejection', (event) => {
  console.error('UniPlan async error:', event.reason)
})

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
