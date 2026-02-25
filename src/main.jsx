import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { PapersProvider } from './context/PapersContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <PapersProvider>
        <App />
      </PapersProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
