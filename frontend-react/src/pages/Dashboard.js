import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { donorAPI, eventAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalDonors: 0,
    eligibleDonors: 0,
    totalEvents: 0,
    upcomingEvents: 0
  });
  const [recentDonors, setRecentDonors] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEventModal, setShowEventModal] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [donorsRes, eventsRes, eligibleRes, upcomingRes] = await Promise.all([
        donorAPI.getAll().catch(() => ({ data: [] })),
        eventAPI.getAll().catch(() => ({ data: [] })),
        donorAPI.getEligible().catch(() => ({ data: [] })),
        eventAPI.getUpcoming().catch(() => ({ data: [] }))
      ]);

      const donors = donorsRes.data || [];
      const events = eventsRes.data || [];
      const eligibleDonors = eligibleRes.data || [];
      const upcomingEventsData = upcomingRes.data || [];

      setStats({
        totalDonors: donors.length,
        eligibleDonors: eligibleDonors.length,
        totalEvents: events.length,
        upcomingEvents: upcomingEventsData.length
      });

      setRecentDonors(donors.slice(-5).reverse());
      setUpcomingEvents(upcomingEventsData.slice(0, 3));
      setAllEvents(events);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEventSelect = (eventId) => {
    setShowEventModal(false);
    navigate(`/events/${eventId}/predict`);
  };

  const getBloodGroupBadgeColor = (bloodGroup) => {
    const colors = {
      'A_POSITIVE': 'bg-danger',
      'A_NEGATIVE': 'bg-warning',
      'B_POSITIVE': 'bg-primary',
      'B_NEGATIVE': 'bg-info',
      'AB_POSITIVE': 'bg-success',
      'AB_NEGATIVE': 'bg-secondary',
      'O_POSITIVE': 'bg-dark',
      'O_NEGATIVE': 'bg-light text-dark'
    };
    return colors[bloodGroup] || 'bg-secondary';
  };

  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  return (
    <div className="container-fluid mt-4 px-4">
      <div className="row">
        <div className="col-12">
          {/* Welcome Banner */}
          <div className="card border-0 shadow-sm mb-4" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
            <div className="card-body py-4">
              <div className="row align-items-center">
                <div className="col-md-8">
                  <h2 className="text-white mb-2">
                    <i className="fas fa-hand-holding-heart me-2"></i>
                    Welcome, {user?.username || 'User'}!
                  </h2>
                  <p className="text-white mb-0 opacity-75">Blood Donation Management System - Saving Lives Together</p>
                </div>
                <div className="col-md-4 text-md-end mt-3 mt-md-0">
                  <Link to="/donors/new" className="btn btn-light me-2">
                    <i className="fas fa-user-plus"></i> Add Donor
                  </Link>
                  <Link to="/events/new" className="btn btn-outline-light">
                    <i className="fas fa-calendar-plus"></i> Create Event
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* ML Prediction Card */}
          <div className="card border-0 shadow-lg mb-4" style={{background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', overflow: 'hidden'}}>
            <div className="card-body text-white text-center py-5 position-relative">
              <div className="position-absolute top-0 start-0 w-100 h-100" style={{opacity: 0.1}}>
                <i className="fas fa-brain" style={{fontSize: '200px', position: 'absolute', top: '-50px', right: '-50px'}}></i>
              </div>
              <div className="position-relative">
                <h2 className="mb-3 fw-bold">
                  <i className="fas fa-brain me-2"></i>
                  ML-Powered Donor Predictions
                </h2>
                <p className="mb-4 fs-5">Select an event to predict eligible donors using Machine Learning with 97% accuracy</p>
                <button 
                  className="btn btn-light btn-lg px-5 py-3 shadow"
                  onClick={() => setShowEventModal(true)}
                  style={{borderRadius: '50px', fontWeight: 'bold'}}
                >
                  <i className="fas fa-chart-line me-2"></i>
                  Predict Donors for Event
                </button>
              </div>
            </div>
          </div>

          {/* Event Selection Modal */}
          {showEventModal && (
            <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
              <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content">
                  <div className="modal-header bg-primary text-white">
                    <h5 className="modal-title"><i className="fas fa-calendar-alt"></i> Select Event for ML Prediction</h5>
                    <button className="btn-close btn-close-white" onClick={() => setShowEventModal(false)}></button>
                  </div>
                  <div className="modal-body">
                    {allEvents.length === 0 ? (
                      <div className="text-center py-4">
                        <i className="fas fa-calendar-times fa-3x text-muted mb-3"></i>
                        <p className="text-muted">No events available. Create an event first.</p>
                        <button className="btn btn-primary" onClick={() => { setShowEventModal(false); navigate('/events/new'); }}>
                          <i className="fas fa-plus"></i> Create Event
                        </button>
                      </div>
                    ) : (
                      <div className="list-group">
                        {allEvents.map(event => (
                          <button
                            key={event.id}
                            className="list-group-item list-group-item-action"
                            onClick={() => handleEventSelect(event.id)}
                          >
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                <h6 className="mb-1"><i className="fas fa-calendar"></i> {event.name}</h6>
                                <p className="mb-1 text-muted">
                                  <i className="fas fa-map-marker-alt"></i> {event.location} • 
                                  <i className="fas fa-clock ms-2"></i> {new Date(event.eventDate).toLocaleDateString()}
                                </p>
                              </div>
                              <span className={`badge ${
                                event.status === 'SCHEDULED' ? 'bg-primary' :
                                event.status === 'ONGOING' ? 'bg-warning' :
                                event.status === 'COMPLETED' ? 'bg-success' : 'bg-danger'
                              }`}>
                                {event.status}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Statistics Section Header */}
          <div className="mb-4">
            <h3 className="fw-bold text-dark">
              <i className="fas fa-chart-bar me-2 text-primary"></i>
              Statistics Overview
            </h3>
            <p className="text-muted">Real-time insights into your blood donation system</p>
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {/* Statistics Cards */}
          <div className="row mb-5 g-4">
            <div className="col-xl-3 col-md-6">
              <div className="card border-0 shadow-sm h-100 hover-lift" style={{borderLeft: '5px solid #667eea', transition: 'transform 0.3s'}}>
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <div className="text-uppercase text-muted mb-2" style={{fontSize: '0.75rem', fontWeight: '600', letterSpacing: '1px'}}>
                        Total Donors
                      </div>
                      <div className="h1 mb-0 fw-bold text-dark">
                        {stats.totalDonors}
                      </div>
                      <small className="text-success"><i className="fas fa-arrow-up"></i> Active</small>
                    </div>
                    <div className="rounded-circle p-3" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
                      <i className="fas fa-users fa-2x text-white"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-md-6">
              <div className="card border-0 shadow-sm h-100 hover-lift" style={{borderLeft: '5px solid #f5576c', transition: 'transform 0.3s'}}>
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <div className="text-uppercase text-muted mb-2" style={{fontSize: '0.75rem', fontWeight: '600', letterSpacing: '1px'}}>
                        Eligible Donors
                      </div>
                      <div className="h1 mb-0 fw-bold text-dark">
                        {stats.eligibleDonors}
                      </div>
                      <small className="text-success"><i className="fas fa-check-circle"></i> Ready</small>
                    </div>
                    <div className="rounded-circle p-3" style={{background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'}}>
                      <i className="fas fa-heart fa-2x text-white"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-md-6">
              <div className="card border-0 shadow-sm h-100 hover-lift" style={{borderLeft: '5px solid #4facfe', transition: 'transform 0.3s'}}>
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <div className="text-uppercase text-muted mb-2" style={{fontSize: '0.75rem', fontWeight: '600', letterSpacing: '1px'}}>
                        Total Events
                      </div>
                      <div className="h1 mb-0 fw-bold text-dark">
                        {stats.totalEvents}
                      </div>
                      <small className="text-info"><i className="fas fa-calendar-check"></i> Scheduled</small>
                    </div>
                    <div className="rounded-circle p-3" style={{background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'}}>
                      <i className="fas fa-calendar fa-2x text-white"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-md-6">
              <div className="card border-0 shadow-sm h-100 hover-lift" style={{borderLeft: '5px solid #fa709a', transition: 'transform 0.3s'}}>
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <div className="text-uppercase text-muted mb-2" style={{fontSize: '0.75rem', fontWeight: '600', letterSpacing: '1px'}}>
                        Upcoming Events
                      </div>
                      <div className="h1 mb-0 fw-bold text-dark">
                        {stats.upcomingEvents}
                      </div>
                      <small className="text-warning"><i className="fas fa-clock"></i> Pending</small>
                    </div>
                    <div className="rounded-circle p-3" style={{background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'}}>
                      <i className="fas fa-clock fa-2x text-white"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity Section */}
          <div className="mb-4">
            <h3 className="fw-bold text-dark">
              <i className="fas fa-history me-2 text-primary"></i>
              Recent Activity
            </h3>
            <p className="text-muted">Latest donors and upcoming events</p>
          </div>

          <div className="row g-4">
            <div className="col-xl-6 col-lg-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
                  <h5 className="m-0 fw-bold text-dark">
                    <i className="fas fa-user-friends me-2 text-primary"></i>
                    Recent Donors
                  </h5>
                  <Link to="/donors" className="btn btn-sm btn-outline-primary">
                    View All <i className="fas fa-arrow-right ms-1"></i>
                  </Link>
                </div>
                <div className="card-body">
                  {recentDonors.length === 0 ? (
                    <p className="text-muted">No donors found</p>
                  ) : (
                    <div className="list-group list-group-flush">
                      {recentDonors.map(donor => (
                        <div key={donor.id} className="list-group-item d-flex justify-content-between align-items-center">
                          <div>
                            <h6 className="mb-1">{donor.name}</h6>
                            <small className="text-muted">
                              {donor.age} years • {donor.gender.toLowerCase()} • 
                              <span className={`badge ${getBloodGroupBadgeColor(donor.bloodGroup)} ms-1`}>
                                {donor.bloodGroup.replace('_', '')}
                              </span>
                            </small>
                          </div>
                          <span className={`badge ${donor.monthsSinceLast >= 3 ? 'bg-success' : 'bg-warning'}`}>
                            {donor.monthsSinceLast >= 3 ? 'Eligible' : 'Recent Donor'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="col-xl-6 col-lg-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
                  <h5 className="m-0 fw-bold text-dark">
                    <i className="fas fa-calendar-alt me-2 text-primary"></i>
                    Upcoming Events
                  </h5>
                  <Link to="/events" className="btn btn-sm btn-outline-primary">
                    View All <i className="fas fa-arrow-right ms-1"></i>
                  </Link>
                </div>
                <div className="card-body">
                  {upcomingEvents.length === 0 ? (
                    <p className="text-muted">No upcoming events</p>
                  ) : (
                    <div className="list-group list-group-flush">
                      {upcomingEvents.map(event => (
                        <div key={event.id} className="list-group-item">
                          <h6 className="mb-1">{event.name}</h6>
                          <p className="mb-1 text-muted">{event.location}</p>
                          <small className="text-muted">
                            {new Date(event.eventDate).toLocaleDateString()} • 
                            <span className={`badge bg-info ms-1`}>
                              {event.status}
                            </span>
                          </small>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;