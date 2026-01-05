import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});
  const [focusedField, setFocusedField] = useState('');
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const validateField = (name, value) => {
    const errors = { ...validationErrors };
    
    switch (name) {
      case 'username':
        if (value.length < 3) {
          errors.username = 'Username must be at least 3 characters';
        } else {
          delete errors.username;
        }
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          errors.email = 'Please enter a valid email address';
        } else {
          delete errors.email;
        }
        break;
      case 'password':
        if (value.length < 6) {
          errors.password = 'Password must be at least 6 characters';
        } else {
          delete errors.password;
        }
        break;
      case 'confirmPassword':
        if (value !== formData.password) {
          errors.confirmPassword = 'Passwords do not match';
        } else {
          delete errors.confirmPassword;
        }
        break;
    }
    
    setValidationErrors(errors);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    if (name === 'password') {
      setPasswordStrength(checkPasswordStrength(value));
    }
    
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (Object.keys(validationErrors).length > 0) {
      setError('Please fix all validation errors');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    const userData = {
      username: formData.username,
      email: formData.email,
      password: formData.password
    };

    const result = await register(userData);
    
    if (result.success) {
      navigate('/login');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 1) return '#ef4444';
    if (passwordStrength <= 3) return '#f59e0b';
    return '#10b981';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 1) return 'Weak';
    if (passwordStrength <= 3) return 'Medium';
    return 'Strong';
  };

  return (
    <div className="min-vh-100 d-flex align-items-center position-relative" style={{
      backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23f1f5f9" fill-opacity="0.4"%3E%3Cpath d="M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm0 0c0 11.046 8.954 20 20 20s20-8.954 20-20-8.954-20-20-20-20 8.954-20 20z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
      backgroundColor: '#fafbfc'
    }}>
      {/* Medical Background Elements */}
      <div className="position-absolute" style={{
        top: '10%',
        left: '5%',
        opacity: '0.1',
        fontSize: '120px',
        color: '#dc2626',
        animation: 'float 6s ease-in-out infinite'
      }}>
        <i className="fas fa-heartbeat"></i>
      </div>
      <div className="position-absolute" style={{
        bottom: '15%',
        right: '8%',
        opacity: '0.1',
        fontSize: '100px',
        color: '#dc2626',
        animation: 'float 4s ease-in-out infinite reverse'
      }}>
        <i className="fas fa-hand-holding-heart"></i>
      </div>
      
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-7">
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
                      <i className="fas fa-tint" style={{fontSize: '24px', color: 'white'}}></i>
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
                      <i className="fas fa-plus" style={{fontSize: '10px', color: 'white'}}></i>
                    </div>
                  </div>
                  <h4 className="fw-bold mb-1" style={{color: '#1f2937'}}>Join Blood Heroes</h4>
                  <p className="text-muted small mb-0">Save lives, be a hero</p>
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
                        className={`form-control ${
                          validationErrors.username ? 'border-danger' : 
                          formData.username && !validationErrors.username ? 'border-success' : ''
                        }`}
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
                      {formData.username && !validationErrors.username && (
                        <i className="fas fa-check-circle position-absolute end-0 top-50 translate-middle-y me-3" 
                           style={{color: '#10b981', fontSize: '20px'}}></i>
                      )}
                    </div>
                    {validationErrors.username && (
                      <small className="text-danger d-flex align-items-center mt-1">
                        <i className="fas fa-times-circle me-1" style={{fontSize: '14px'}}></i>
                        {validationErrors.username}
                      </small>
                    )}
                  </div>
                  
                  {/* Email Field */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold small d-flex align-items-center">
                      <i className="fas fa-envelope me-2" style={{color: '#dc2626', fontSize: '14px'}}></i>
                      Email
                    </label>
                    <div className="position-relative">
                      <input
                        type="email"
                        className={`form-control ${
                          validationErrors.email ? 'border-danger' : 
                          formData.email && !validationErrors.email ? 'border-success' : ''
                        }`}
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField('')}
                        placeholder="Enter email"
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
                      {formData.email && !validationErrors.email && (
                        <i className="fas fa-check-circle position-absolute end-0 top-50 translate-middle-y me-3" 
                           style={{color: '#10b981', fontSize: '20px'}}></i>
                      )}
                    </div>
                    {validationErrors.email && (
                      <small className="text-danger d-flex align-items-center mt-1">
                        <i className="fas fa-times-circle me-1" style={{fontSize: '14px'}}></i>
                        {validationErrors.email}
                      </small>
                    )}
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
                        className={`form-control ${
                          validationErrors.password ? 'border-danger' : 
                          formData.password && !validationErrors.password ? 'border-success' : ''
                        }`}
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
                    
                    {formData.password && (
                      <div className="mt-2">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <small className="text-muted">Password Strength:</small>
                          <small style={{color: getPasswordStrengthColor(), fontWeight: 'bold'}}>
                            {getPasswordStrengthText()}
                          </small>
                        </div>
                        <div className="progress" style={{height: '4px', borderRadius: '2px'}}>
                          <div 
                            className="progress-bar" 
                            style={{
                              width: `${(passwordStrength / 5) * 100}%`,
                              backgroundColor: getPasswordStrengthColor(),
                              transition: 'all 0.5s ease'
                            }}
                          ></div>
                        </div>
                      </div>
                    )}
                    
                    {validationErrors.password && (
                      <small className="text-danger d-flex align-items-center mt-1">
                        <i className="fas fa-times-circle me-1" style={{fontSize: '14px'}}></i>
                        {validationErrors.password}
                      </small>
                    )}
                  </div>
                  
                  {/* Confirm Password Field */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold small d-flex align-items-center">
                      <i className="fas fa-shield-alt me-2" style={{color: '#dc2626', fontSize: '14px'}}></i>
                      Confirm
                    </label>
                    <div className="position-relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        className={`form-control ${
                          validationErrors.confirmPassword ? 'border-danger' : 
                          formData.confirmPassword && formData.password === formData.confirmPassword ? 'border-success' : ''
                        }`}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('confirmPassword')}
                        onBlur={() => setFocusedField('')}
                        placeholder="Confirm password"
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
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        style={{
                          border: 'none',
                          background: 'none',
                          padding: '0 12px'
                        }}
                      >
                        <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`} style={{color: '#6b7280'}}></i>
                      </button>
                      {formData.confirmPassword && formData.password === formData.confirmPassword && (
                        <i className="fas fa-check-circle position-absolute" 
                           style={{
                             right: '35px',
                             top: '50%',
                             transform: 'translateY(-50%)',
                             color: '#10b981',
                             fontSize: '16px'
                           }}></i>
                      )}
                    </div>
                    {validationErrors.confirmPassword && (
                      <small className="text-danger d-flex align-items-center mt-1">
                        <i className="fas fa-times-circle me-1" style={{fontSize: '14px'}}></i>
                        {validationErrors.confirmPassword}
                      </small>
                    )}
                  </div>
                  
                  {/* Submit Button */}
                  <button 
                    type="submit" 
                    className="btn w-100 mb-3"
                    disabled={loading || Object.keys(validationErrors).length > 0}
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
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-user-plus me-2"></i>
                        Create Account
                      </>
                    )}
                  </button>
                </form>
                
                {/* Login Link */}
                <div className="text-center">
                  <p className="text-muted small mb-2">Already have an account?</p>
                  <Link 
                    to="/login" 
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
                    <i className="fas fa-sign-in-alt me-1"></i>
                    Sign In
                  </Link>
                </div>
                
                {/* Security Badge */}
                <div className="text-center mt-3">
                  <small className="text-muted d-flex align-items-center justify-content-center" style={{fontSize: '11px'}}>
                    <i className="fas fa-shield-alt me-1"></i>
                    Secure & Protected
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
        
        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% { transform: translateY(0); }
          40%, 43% { transform: translateY(-10px); }
          70% { transform: translateY(-5px); }
        }
        
        .form-control:focus {
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
          border-color: #3b82f6 !important;
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

export default Register;