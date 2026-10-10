import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/auth/ProtectedRoute'
import { queryClient } from './lib/queryClient'

// Pages
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import StudentList from './pages/StudentList'
import StudentProfile from './pages/StudentProfile'
import RiskAnalysis from './pages/RiskAnalysis'
import Interventions from './pages/Interventions'
import Notifications from './pages/Notifications'
import Reports from './pages/Reports'
import DataCenter from './pages/DataCenter'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/students"
              element={
                <ProtectedRoute requiredRole="teacher">
                  <StudentList />
                </ProtectedRoute>
              }
            />

            <Route
              path="/students/:studentId"
              element={
                <ProtectedRoute requiredRole="teacher">
                  <StudentProfile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/risk-analysis"
              element={
                <ProtectedRoute requiredRole="teacher">
                  <RiskAnalysis />
                </ProtectedRoute>
              }
            />

            <Route
              path="/interventions"
              element={
                <ProtectedRoute requiredRole="teacher">
                  <Interventions />
                </ProtectedRoute>
              }
            />

            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              }
            />

            <Route
              path="/reports"
              element={
                <ProtectedRoute requiredRole="teacher">
                  <Reports />
                </ProtectedRoute>
              }
            />

            <Route
              path="/data-center"
              element={
                <ProtectedRoute requiredRole="admin">
                  <DataCenter />
                </ProtectedRoute>
              }
            />

            <Route
              path="/settings"
              element={
                <ProtectedRoute requiredRole="admin">
                  <Settings />
                </ProtectedRoute>
              }
            />

            {/* Error Routes */}
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </AuthProvider>
      </Router>
      
      {/* Toast Notifications */}
      <Toaster position="top-right" />
      
      {/* React Query Devtools (dev only) */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App
