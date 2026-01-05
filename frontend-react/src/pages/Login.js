import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(formData.username, formData.password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-vh-100 d-flex align-items-center position-relative" style={{
      backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23f1f5f9" fill-opacity="0.4"%3E%3Cpath d="M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm0 0c0 11.046 8.954 20 20 20s20-8.954 20-20-8.954-20-20-20-20 8.954-20 20z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
      backgroundColor: '#fafbfc'
    }}>
      {/* Medical Background Elements */}
      <div className="position-absolute" style={{
        top: '15%',
        left: '8%',
        opacity: '0.1',
        fontSize: '100px',
        color: '#dc2626',
        animation: 'float 5s ease-in-out infinite'
      }}>
        <i className="fas fa-stethoscope"></i>
      </div>
      <div className="position-absolute" style={{
        bottom: '20%',
        right: '10%',
        opacity: '0.1',
        fontSize: '90px',
        color: '#dc2626',
        animation: 'float 4s ease-in-out infinite reverse'
      }}>
        <i className="fas fa-user-md"></i>
      </div>
      
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-4 col-md-6">
            <div className="card shadow-lg border-0" style={{
              borderRadius: '20px',
              backdropFilter: 'blur(10px)',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              transform: 'translateY(0)',
              transition: 'all 0.3s ease'
            }}>
              <div className="card-body p-4">
                <div className="text-center mb-4">
                  <div className="position-relative d-inline-block mb-3">
                    <div className="d-inline-flex align-items-center justify-content-center" style={{
                      width: '60px',
                      height: '60px',
                      background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                      borderRadius: '50%',
                      animation: focusedField ? 'pulse 1s' : 'none',
                      boxShadow: '0 8px 25px rgba(220, 38, 38, 0.3)'
                    }}>
                      <i className="fas fa-sign-in-alt" style={{fontSize: '24px', color: 'white'}}></i>
                    </div>
                    <div className="position-absolute" style={{
                      top: '-5px',
                      right: '-5px',
                      width: '20px',
                      height: '20px',
                      background: '#10b981',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <i className="fas fa-check" style={{fontSize: '10px', color: 'white'}}></i>
                    </div>
                  </div>
                  <h4 className="fw-bold mb-1" style={{color: '#1f2937'}}>Welcome Back</h4>
                  <p className="text-muted small mb-0">Sign in to continue</p>
                </div>
                {error && (
                  <div className="alert alert-danger d-flex align-items-center mb-4" style={{
                    borderRadius: '12px',
                    border: 'none',
                    backgroundColor: '#fef2f2',
                    color: '#dc2626'
                  }}>
                    <i className="fas fa-times-circle me-2"></i>
                    {error}
                  </div>
                )}
                <form onSubmit={handleSubmit}>
                  {/* Username Field */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold small d-flex align-items-center">
                      <i className="fas fa-user me-2" style={{color: '#dc2626', fontSize: '14px'}}></i>
                      Username
                    </label>
                    <div className="position-relative">
                      <input
                        type="text"
                        className="form-control"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('username')}
                        onBlur={() => setFocusedField('')}
                        placeholder="Enter username"
                        required
                        disabled={loading}
                        style={{
                          borderRadius: '10px',
                          border: '1px solid #e5e7eb',
                          transition: 'all 0.3s ease',
                          paddingLeft: '12px',
                          height: '42px',
                          fontSize: '14px'
                        }}
                      />
                      {formData.username && (
                        <i className="fas fa-check-circle position-absolute end-0 top-50 translate-middle-y me-3" 
                           style={{color: '#10b981', fontSize: '16px'}}></i>
                      )}
                    </div>
                  </div>
                  
                  {/* Password Field */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold small d-flex align-items-center">
                      <i className="fas fa-lock me-2" style={{color: '#dc2626', fontSize: '14px'}}></i>
                      Password
                    </label>
                    <div className="position-relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="form-control"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('password')}
                        onBlur={() => setFocusedField('')}
                        placeholder="Enter password"
                        required
                        disabled={loading}
                        style={{
                          borderRadius: '10px',
                          border: '1px solid #e5e7eb',
                          transition: 'all 0.3s ease',
                          paddingLeft: '12px',
                          paddingRight: '40px',
                          height: '42px',
                          fontSize: '14px'
                        }}
                      />
                      <button
                        type="button"
                        className="btn position-absolute end-0 top-50 translate-middle-y"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          border: 'none',
                          background: 'none',
                          padding: '0 12px'
                        }}
                      >
                        <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} style={{color: '#6b7280'}}></i>
                      </button>
                    </div>
                  </div>
                  {/* Submit Button */}
                  <button 
                    type="submit" 
                    className="btn w-100 mb-3"
                    disabled={loading}
                    style={{
                      borderRadius: '10px',
                      background: loading ? '#9ca3af' : 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                      border: 'none',
                      color: 'white',
                      fontWeight: '600',
                      transition: 'all 0.3s ease',
                      height: '45px',
                      fontSize: '14px',
                      boxShadow: loading ? 'none' : '0 4px 15px rgba(220, 38, 38, 0.3)'
                    }}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Signing In...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-sign-in-alt me-2"></i>
                        Sign In
                      </>
                    )}
                  </button>
                </form>
                
                {/* Register Link */}
                <div className="text-center">
                  <p className="text-muted small mb-2">Don't have an account?</p>
                  <Link 
                    to="/register" 
                    className="btn btn-outline-danger btn-sm"
                    style={{
                      borderRadius: '8px',
                      border: '1px solid #dc2626',
                      color: '#dc2626',
                      fontWeight: '500',
                      fontSize: '13px',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <i className="fas fa-user-plus me-1"></i>
                    Create Account
                  </Link>
                </div>
                
                {/* Security Badge */}
                <div className="text-center mt-3">
                  <small className="text-muted d-flex align-items-center justify-content-center" style={{fontSize: '11px'}}>
                    <i className="fas fa-shield-alt me-1"></i>
                    Secure Login
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        .form-control:focus {
          box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1) !important;
          border-color: #dc2626 !important;
        }
        
        .btn:hover {
          transform: translateY(-2px) !important;
        }
        
        .card:hover {
          transform: translateY(-5px) !important;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1) !important;
        }
      `}</style>
    </div>
  );
};

export default Login;