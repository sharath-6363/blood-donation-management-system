import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DonorForm from './pages/DonorForm';
import DonorList from './pages/DonorList';
import DonorProfile from './pages/DonorProfile';
import EventPage from './pages/EventPage';
import EventForm from './pages/EventForm';
import EventDetail from './pages/EventDetail';
import EventDonorPredict from './pages/EventDonorPredict';
import Navbar from './components/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

function AppContent() {
  const { user } = useAuth();

  return (
    <div className="App">
      {user && <Navbar />}
      <div className="container-fluid">
        <Routes>
          <Route 
            path="/" 
            element={<Home />} 
          />
          <Route 
            path="/login" 
            element={!user ? <Login /> : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/register" 
            element={!user ? <Register /> : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/dashboard" 
            element={user ? <Dashboard /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/donors" 
            element={user ? <DonorList /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/donors/new" 
            element={user ? <DonorForm /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/donors/edit/:id" 
            element={user ? <DonorForm /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/donors/profile/:id" 
            element={user ? <DonorProfile /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/events" 
            element={user ? <EventPage /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/events/new" 
            element={user ? <EventForm /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/events/edit/:id" 
            element={user ? <EventForm /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/events/:id" 
            element={user ? <EventDetail /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/events/:eventId/predict" 
            element={user ? <EventDonorPredict /> : <Navigate to="/login" />} 
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;