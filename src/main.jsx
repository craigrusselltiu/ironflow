import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { RoutineProvider } from './contexts/RoutineContext'
import App from './components/App'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { ExerciseBrowserPage } from './pages/ExerciseBrowserPage'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <RoutineProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/exercises" element={<ExerciseBrowserPage />} />
            <Route path="/*" element={<App />} />
          </Routes>
        </RoutineProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
