import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import home1 from "./homeimage1.png";

const Home = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="home-page">
      {/* Header */}
      <header className={`home-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <span className="logo-icon"><i className="fas fa-heart"></i></span>
              <span className="logo-text">Blood Center</span>
            </div>
            <nav className="nav-menu">
              <a href="#home">Home</a>
              <a href="#about">About Us</a>
              <a href="#services">Services</a>
              <a href="#contact">Contact</a>
              <Link to="/login" className="btn-login">Login</Link>
              <Link to="/register" className="btn-register">Register</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section" id="home">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                Your Blood Donation<br />
                <span className="highlight">Matters. Give Today!</span>
              </h1>
              <p className="hero-description">
                Join thousands of donors who are making a difference. Your single donation can save up to three lives.
              </p>
              <div className="hero-buttons">
                <Link to="/register" className="btn-primary-hero">Become a Donor</Link>
                <a href="#about" className="btn-secondary-hero">Learn More</a>
              </div>
            </div>
            <div className="hero-image">
              <div className="image-placeholder">
                <div className="blood-drop">
                  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <path d="M50 10 C30 30, 20 50, 20 65 C20 80, 32 90, 50 90 C68 90, 80 80, 80 65 C80 50, 70 30, 50 10 Z" fill="#ff3700c6"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section" id="about">
        <div className="container">
          <div className="section-header">
            <h2>Who We Are</h2>
            <div className="underline"></div>
          </div>
          <div className="about-content">
            <div className="about-image">

              <div className="about-img-placeholder">
                                <img src={home1}alt='homeimage'className='w-100 rounded-5 h-100'></img>

              </div>
            </div>
            <div className="about-text">
              <h3>Saving Lives Through Blood Donation</h3>
              <p>
                We are a dedicated blood donation center committed to ensuring a safe and adequate blood supply for our community. 
                With state-of-the-art facilities and experienced medical professionals, we make the donation process safe, 
                comfortable, and rewarding.
              </p>
              <div className="stats-grid">
                <div className="stat-item">
                  <h4>10,000+</h4>
                  <p>Active Donors</p>
                </div>
                <div className="stat-item">
                  <h4>50,000+</h4>
                  <p>Lives Saved</p>
                </div>
                <div className="stat-item">
                  <h4>100+</h4>
                  <p>Blood Drives</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section" id="services">
        <div className="container">
          <div className="section-header">
            <h2>Our Services</h2>
            <div className="underline"></div>
          </div>
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon"><i className="fas fa-tint"></i></div>
              <h3>Blood Donation</h3>
              <p>Safe and comfortable blood donation process with trained professionals.</p>
            </div>
            <div className="service-card">
              <div className="service-icon"><i className="fas fa-calendar-alt"></i></div>
              <h3>Schedule Events</h3>
              <p>Organize and participate in blood donation drives in your community.</p>
            </div>
            <div className="service-card">
              <div className="service-icon"><i className="fas fa-search"></i></div>
              <h3>Donor Tracking</h3>
              <p>Track your donation history and receive timely reminders.</p>
            </div>
            <div className="service-card">
              <div className="service-icon"><i className="fas fa-hospital"></i></div>
              <h3>Emergency Supply</h3>
              <p>24/7 emergency blood supply for hospitals and medical facilities.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Make a Difference?</h2>
            <p>Join our community of lifesavers today</p>
            <Link to="/register" className="btn-cta">Get Started Now</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer" id="contact">
        <div className="container">
          <div className="footer-content">
            <div className="footer-col">
              <h4>Blood Center</h4>
              <p>Saving lives one donation at a time.</p>
              <div className="social-links">
                <a href="#" className="social-icon"><i className="fab fa-facebook"></i></a>
                <a href="#" className="social-icon"><i className="fab fa-twitter"></i></a>
                <a href="#" className="social-icon"><i className="fab fa-instagram"></i></a>
              </div>
            </div>
            <div className="footer-col">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About Us</a></li>
                <li><a href="#services">Services</a></li>
                <li><Link to="/login">Login</Link></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Contact Info</h4>
              <ul>
                <li><i className="fas fa-phone"></i> +1 234 567 8900</li>
                <li><i className="fas fa-envelope"></i> info@bloodcenter.com</li>
                <li><i className="fas fa-map-marker-alt"></i> 123 Health St, Medical City</li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 Blood Center. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
