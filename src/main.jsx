import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { RoutineProvider } from './contexts/RoutineContext'
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
    <BrowserRouter basename={basename}>
      <AuthProvider>
        <RoutineProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path="builder" element={<RoutineBuilderPage />} />
              <Route path="exercises" element={<ExerciseBrowserPage />} />
            </Route>
          </Routes>
        </RoutineProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
