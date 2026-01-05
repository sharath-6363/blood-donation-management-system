import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const EventPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await eventAPI.getAll();
      setEvents(response.data);
    } catch (error) {
      setError('Failed to load events');
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await eventAPI.delete(id);
        setEvents(events.filter(event => event.id !== id));
      } catch (error) {
        setError('Failed to delete event');
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'SCHEDULED': 'bg-primary',
      'ONGOING': 'bg-warning',
      'COMPLETED': 'bg-success',
      'CANCELLED': 'bg-danger'
    };
    return statusConfig[status] || 'bg-secondary';
  };

  if (loading) {
    return <LoadingSpinner message="Loading events..." />;
  }

  return (
    <div className="container-fluid mt-4 px-4">
      <div className="row">
        <div className="col-12">
          {/* Page Header */}
          <div className="card border-0 shadow-sm mb-4" style={{background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'}}>
            <div className="card-body py-4">
              <div className="row align-items-center">
                <div className="col-md-8">
                  <h2 className="text-white mb-2 fw-bold">
                    <i className="fas fa-calendar-alt me-2"></i>
                    Event Management
                  </h2>
                  <p className="text-white mb-0 opacity-75">Organize and manage blood donation events</p>
                </div>
                <div className="col-md-4 text-md-end mt-3 mt-md-0">
                  <Link to="/events/new" className="btn btn-light btn-lg">
                    <i className="fas fa-calendar-plus me-2"></i>Create Event
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <div className="row">
            {events.length === 0 ? (
              <div className="col-12">
                <div className="card">
                  <div className="card-body text-center py-5">
                    <i className="fas fa-calendar-times fa-3x text-muted mb-3"></i>
                    <h4 className="text-muted">No Events Found</h4>
                    <p className="text-muted">Get started by creating your first blood donation event.</p>
                    <Link to="/events/new" className="btn btn-primary">
                      Create First Event
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              events.map(event => (
                <div key={event.id} className="col-xl-4 col-lg-6 mb-4">
                  <div className="card border-0 shadow-sm h-100 hover-lift" style={{borderRadius: '15px', overflow: 'hidden'}}>
                    <div className="card-header border-0 py-3" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
                      <div className="d-flex justify-content-between align-items-center">
                        <h5 className="mb-0 text-white fw-bold">
                          <i className="fas fa-calendar-check me-2"></i>
                          {event.name}
                        </h5>
                        <span className={`badge ${getStatusBadge(event.status)} px-3 py-2`}>
                          {event.status}
                        </span>
                      </div>
                    </div>
                    <div className="card-body p-4">
                      <div className="mb-3">
                        <div className="d-flex align-items-center mb-2">
                          <div className="bg-danger bg-opacity-10 rounded-circle p-2 me-3" style={{width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            <i className="fas fa-map-marker-alt text-danger"></i>
                          </div>
                          <div>
                            <small className="text-muted d-block" style={{fontSize: '0.75rem'}}>Location</small>
                            <strong>{event.location}</strong>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <div className="d-flex align-items-center mb-2">
                          <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3" style={{width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            <i className="fas fa-calendar text-primary"></i>
                          </div>
                          <div>
                            <small className="text-muted d-block" style={{fontSize: '0.75rem'}}>Event Date</small>
                            <strong>{new Date(event.eventDate).toLocaleDateString('en-US', {weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'})}</strong>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <div className="d-flex align-items-center mb-2">
                          <div className="bg-success bg-opacity-10 rounded-circle p-2 me-3" style={{width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            <i className="fas fa-users text-success"></i>
                          </div>
                          <div>
                            <small className="text-muted d-block" style={{fontSize: '0.75rem'}}>Target Donors</small>
                            <strong>{event.targetDonors} donors</strong>
                          </div>
                        </div>
                      </div>
                      
                      {event.requiredBloodGroups && (
                        <div className="mt-3 pt-3 border-top">
                          <small className="text-muted d-block mb-2" style={{fontSize: '0.75rem', fontWeight: '600'}}>REQUIRED BLOOD GROUPS</small>
                          <div className="d-flex flex-wrap gap-2">
                            {JSON.parse(event.requiredBloodGroups).map((bg, index) => {
                              const formatted = bg.replace('A_POSITIVE', 'A+').replace('A_NEGATIVE', 'A-')
                                .replace('B_POSITIVE', 'B+').replace('B_NEGATIVE', 'B-')
                                .replace('AB_POSITIVE', 'AB+').replace('AB_NEGATIVE', 'AB-')
                                .replace('O_POSITIVE', 'O+').replace('O_NEGATIVE', 'O-');
                              return (
                                <span key={index} className="badge bg-danger px-3 py-2" style={{fontSize: '0.85rem'}}>
                                  <i className="fas fa-tint me-1"></i>{formatted}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="card-footer bg-white border-0 p-3">
                      <div className="d-flex gap-2">
                        <Link
                          to={`/events/${event.id}`}
                          className="btn btn-outline-primary btn-sm flex-fill"
                        >
                          <i className="fas fa-eye me-1"></i>View
                        </Link>
                        <Link
                          to={`/events/edit/${event.id}`}
                          className="btn btn-outline-warning btn-sm flex-fill"
                        >
                          <i className="fas fa-edit me-1"></i>Edit
                        </Link>
                        <button
                          className="btn btn-outline-danger btn-sm flex-fill"
                          onClick={() => handleDelete(event.id)}
                        >
                          <i className="fas fa-trash me-1"></i>Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventPage;