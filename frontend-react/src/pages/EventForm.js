import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { eventAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const EventForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    eventDate: '',
    requiredBloodGroups: [],
    targetDonors: '',
    status: 'SCHEDULED'
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const bloodGroups = [
    'A_POSITIVE', 'A_NEGATIVE', 'B_POSITIVE', 'B_NEGATIVE',
    'AB_POSITIVE', 'AB_NEGATIVE', 'O_POSITIVE', 'O_NEGATIVE'
  ];

  useEffect(() => {
    if (isEdit) {
      fetchEvent();
    }
  }, [id]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const response = await eventAPI.getById(id);
      const event = response.data;
      
      const formattedData = {
        ...event,
        eventDate: event.eventDate.split('T')[0],
        requiredBloodGroups: event.requiredBloodGroups ? JSON.parse(event.requiredBloodGroups) : []
      };
      
      setFormData(formattedData);
    } catch (error) {
      setError('Failed to load event data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBloodGroupChange = (bloodGroup) => {
    setFormData(prev => ({
      ...prev,
      requiredBloodGroups: prev.requiredBloodGroups.includes(bloodGroup)
        ? prev.requiredBloodGroups.filter(bg => bg !== bloodGroup)
        : [...prev.requiredBloodGroups, bloodGroup]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const eventData = {
        ...formData,
        requiredBloodGroups: JSON.stringify(formData.requiredBloodGroups)
      };

      if (isEdit) {
        await eventAPI.update(id, eventData);
      } else {
        await eventAPI.create(eventData);
      }
      navigate('/events');
    } catch (error) {
      setError('Failed to save event: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading && isEdit) {
    return <LoadingSpinner message="Loading event data..." />;
  }

  return (
    <div className="container-fluid mt-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title mb-0">
                {isEdit ? 'Edit Event' : 'Create New Event'}
              </h4>
            </div>
            <div className="card-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Event Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Location *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Event Date *</label>
                    <input
                      type="date"
                      className="form-control"
                      name="eventDate"
                      value={formData.eventDate}
                      onChange={handleChange}
                      required
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Target Donors *</label>
                    <input
                      type="number"
                      className="form-control"
                      name="targetDonors"
                      value={formData.targetDonors}
                      onChange={handleChange}
                      required
                      min="1"
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Status</label>
                    <select
                      className="form-select"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                    >
                      <option value="SCHEDULED">Scheduled</option>
                      <option value="ONGOING">Ongoing</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label">Required Blood Groups</label>
                  <div className="row">
                    {bloodGroups.map(bloodGroup => (
                      <div key={bloodGroup} className="col-md-3 mb-2">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={formData.requiredBloodGroups.includes(bloodGroup)}
                            onChange={() => handleBloodGroupChange(bloodGroup)}
                            id={`bloodGroup-${bloodGroup}`}
                          />
                          <label 
                            className="form-check-label" 
                            htmlFor={`bloodGroup-${bloodGroup}`}
                          >
                            {bloodGroup.replace('_', '')}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="d-flex gap-2 justify-content-end">
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Saving...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-save me-2"></i>
                        {isEdit ? 'Update Event' : 'Create Event'}
                      </>
                    )}
                  </button>
                  
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => navigate('/events')}
                  >
                    <i className="fas fa-times me-2"></i>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventForm;