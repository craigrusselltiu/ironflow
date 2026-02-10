import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { RoutineProvider } from './contexts/RoutineContext'
import { ToastProvider } from './contexts/ToastContext'
import { ErrorBoundary } from './components/ErrorBoundary'
import { MainLayout } from './components/MainLayout'
import { HomePage } from './pages/HomePage'
import { RoutineBuilderPage } from './pages/RoutineBuilderPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { ExerciseBrowserPage } from './pages/ExerciseBrowserPage'
import './index.css'

const basename = import.meta.env.PROD ? '/ironflow' : '/';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter basename={basename}>
        <AuthProvider>
          <ToastProvider>
            <RoutineProvider>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/" element={<MainLayout />}>
                  <Route index element={<HomePage />} />
                  <Route path="builder" element={
                    <ErrorBoundary>
                      <RoutineBuilderPage />
                    </ErrorBoundary>
                  } />
                  <Route path="exercises" element={
                    <ErrorBoundary>
                      <ExerciseBrowserPage />
                    </ErrorBoundary>
                  } />
                </Route>
              </Routes>
            </RoutineProvider>
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
)
