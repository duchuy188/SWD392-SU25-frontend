import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Main pages
import Home from './pages/Home';
import Majors from './pages/Majors';
import Career from './pages/Career';
import Chatbot from './pages/Chatbot';
import Contact from './pages/Contact';
import Login from './auth/Login';
import Register from './auth/Register';
import Profile from './pages/Profile';
import ChatHistory from './pages/ChatHistory';
import Unauthorized from './pages/Unauthorized';
import NotFound from './pages/NotFound';
import ForgotPassword from './auth/ForgotPassword';
import VerifyOtp from './auth/VerifyOtp';
import ResetPassword from './auth/ResetPassword';

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Router>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/majors" element={<Majors />} />
            <Route path="/career" element={<Career />} />
            <Route path="/chatbot" element={<Chatbot />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            {/* Protected routes - any authenticated user */}
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/chat-history" 
              element={
                <ProtectedRoute>
                  <ChatHistory />
                </ProtectedRoute>
              } 
            />
            
            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;