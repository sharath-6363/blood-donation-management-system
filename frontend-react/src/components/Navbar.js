import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top" style={{borderBottom: '3px solid #dc3545'}}>
      <div className="container-fluid px-4">
        <Link className="navbar-brand fw-bold d-flex align-items-center" to="/dashboard" style={{fontSize: '1.3rem'}}>
          <div className="bg-danger rounded-circle p-2 me-2" style={{width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <i className="fas fa-heartbeat text-white"></i>
          </div>
          <span className="text-dark">Blood<span className="text-danger">Donate</span></span>
        </Link>
        
        <button 
          className="navbar-toggler border-0" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto">
            <li className="nav-item mx-2">
              <Link className="nav-link fw-semibold text-dark px-3 py-2 rounded" to="/dashboard" style={{transition: 'all 0.3s'}}>
                <i className="fas fa-home me-2 text-danger"></i>Dashboard
              </Link>
            </li>
            <li className="nav-item mx-2">
              <Link className="nav-link fw-semibold text-dark px-3 py-2 rounded" to="/donors" style={{transition: 'all 0.3s'}}>
                <i className="fas fa-users me-2 text-danger"></i>Donors
              </Link>
            </li>
            <li className="nav-item mx-2">
              <Link className="nav-link fw-semibold text-dark px-3 py-2 rounded" to="/events" style={{transition: 'all 0.3s'}}>
                <i className="fas fa-calendar-alt me-2 text-danger"></i>Events
              </Link>
            </li>
          </ul>
          
          <ul className="navbar-nav align-items-center">
            <li className="nav-item me-3">
              <button 
                className="btn btn-sm" 
                onClick={toggleDarkMode}
                style={{
                  padding: '8px 16px',
                  background: darkMode ? 'linear-gradient(135deg, #ffd89b 0%, #19547b 100%)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  borderRadius: '20px',
                  transition: 'all 0.3s',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                }}
                title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                <i className={`fas fa-${darkMode ? 'sun' : 'moon'} text-white me-2`}></i>
                <span className="text-white fw-semibold" style={{fontSize: '0.85rem'}}>
                  {darkMode ? 'Light' : 'Dark'}
                </span>
              </button>
            </li>
            <li className="nav-item dropdown">
              <a 
                className="nav-link dropdown-toggle d-flex align-items-center text-dark fw-semibold" 
                href="#" 
                role="button" 
                data-bs-toggle="dropdown"
                style={{background: '#f8f9fa', padding: '8px 16px', borderRadius: '25px'}}
              >
                <div className="bg-danger rounded-circle me-2" style={{width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <i className="fas fa-user text-white"></i>
                </div>
                {user?.username}
              </a>
              <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2" style={{borderRadius: '12px'}}>
                <li>
                  <button className="dropdown-item py-2" onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt me-2 text-danger"></i>Logout
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;