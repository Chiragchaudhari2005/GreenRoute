import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ResidentDashboard from './pages/ResidentDashboard';
import SchedulePickupPage from './pages/SchedulePickupPage';
import BookingDetailsPage from './pages/BookingDetailsPage';
import AdminDashboard from './pages/AdminDashboard';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <div className="flex flex-col min-h-screen bg-white text-brand-black selection:bg-brand-tint4 selection:text-brand-shade4">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Resident Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <ResidentDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/schedule"
                  element={
                    <ProtectedRoute>
                      <SchedulePickupPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/booking/:id"
                  element={
                    <ProtectedRoute>
                      <BookingDetailsPage />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Console Route */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute adminOnly>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Fallback 404 */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
