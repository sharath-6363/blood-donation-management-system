import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { eventAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const response = await eventAPI.getById(id);
      setEvent(response.data);
    } catch (error) {
      console.error('Error fetching event:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await eventAPI.delete(id);
        navigate('/events');
      } catch (error) {
        alert('Failed to delete event');
      }
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!event) return <div className="alert alert-danger">Event not found</div>;

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2><i className="fas fa-calendar-alt"></i> Event Details</h2>
            <div>
              <button onClick={() => navigate(`/events/${id}/predict`)} className="btn btn-success me-2">
                <i className="fas fa-brain"></i> ML Predict Donors
              </button>
              <Link to={`/events/edit/${id}`} className="btn btn-warning me-2">
                <i className="fas fa-edit"></i> Edit
              </Link>
              <button onClick={handleDelete} className="btn btn-danger me-2">
                <i className="fas fa-trash"></i> Delete
              </button>
              <button onClick={() => navigate('/events')} className="btn btn-secondary">
                <i className="fas fa-arrow-left"></i> Back
              </button>
            </div>
          </div>

          <div className="card shadow-lg">
            <div className="card-header bg-primary text-white">
              <h3 className="mb-0">{event.name}</h3>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <h5><i className="fas fa-map-marker-alt text-danger"></i> Location</h5>
                  <p className="lead">{event.location}</p>
                </div>
                <div className="col-md-6 mb-3">
                  <h5><i className="fas fa-calendar text-primary"></i> Date</h5>
                  <p className="lead">{new Date(event.eventDate).toLocaleDateString('en-US', { 
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
                  })}</p>
                </div>
                <div className="col-md-6 mb-3">
                  <h5><i className="fas fa-users text-success"></i> Target Donors</h5>
                  <p className="lead">{event.targetDonors} donors</p>
                </div>
                <div className="col-md-6 mb-3">
                  <h5><i className="fas fa-info-circle text-info"></i> Status</h5>
                  <p>
                    <span className={`badge fs-5 ${
                      event.status === 'SCHEDULED' ? 'bg-primary' :
                      event.status === 'ONGOING' ? 'bg-warning' :
                      event.status === 'COMPLETED' ? 'bg-success' : 'bg-danger'
                    }`}>
                      {event.status}
                    </span>
                  </p>
                </div>
              </div>

              {event.requiredBloodGroups && (
                <div className="mt-4">
                  <h5><i className="fas fa-tint text-danger"></i> Required Blood Groups</h5>
                  <div className="d-flex gap-2 flex-wrap mt-2">
                    {JSON.parse(event.requiredBloodGroups).map((bg, index) => {
                      const formatted = bg.replace('A_POSITIVE', 'A+').replace('A_NEGATIVE', 'A-')
                        .replace('B_POSITIVE', 'B+').replace('B_NEGATIVE', 'B-')
                        .replace('AB_POSITIVE', 'AB+').replace('AB_NEGATIVE', 'AB-')
                        .replace('O_POSITIVE', 'O+').replace('O_NEGATIVE', 'O-')
                        .replace('APOSITIVE', 'A+').replace('ANEGATIVE', 'A-')
                        .replace('BPOSITIVE', 'B+').replace('BNEGATIVE', 'B-')
                        .replace('ABPOSITIVE', 'AB+').replace('ABNEGATIVE', 'AB-')
                        .replace('OPOSITIVE', 'O+').replace('ONEGATIVE', 'O-');
                      return (
                        <span key={index} className="badge bg-danger fs-6 px-3 py-2">
                          {formatted}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
