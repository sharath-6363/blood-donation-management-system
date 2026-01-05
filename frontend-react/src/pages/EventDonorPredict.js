import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventAPI } from '../services/api';
import axios from 'axios';

const EventDonorPredict = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterLocation, setFilterLocation] = useState('');
  const [filterBloodGroup, setFilterBloodGroup] = useState('');
  const [filterName, setFilterName] = useState('');

  useEffect(() => {
    fetchEventAndPredictions();
  }, [eventId]);

  const fetchEventAndPredictions = async () => {
    try {
      const predictRes = await axios.get(`http://localhost:8080/api/donors/predict-for-event/${eventId}`);
      setEvent({
        name: predictRes.data.eventName,
        location: predictRes.data.eventLocation,
        eventDate: predictRes.data.eventDate,
        targetDonors: 0
      });
      setPredictions(predictRes.data.predictions || []);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to load eligible donors.');
    } finally {
      setLoading(false);
    }
  };

  const filteredPredictions = predictions
    .filter(p => {
      const matchesLocation = !filterLocation || (p.location && p.location.toLowerCase().includes(filterLocation.toLowerCase()));
      const matchesBloodGroup = !filterBloodGroup || p.bloodGroup === filterBloodGroup;
      const matchesName = !filterName || (p.donorName && p.donorName.toLowerCase().includes(filterName.toLowerCase()));
      return matchesLocation && matchesBloodGroup && matchesName;
    })
    .sort((a, b) => {
      // Sort by: 1. Location priority (2=exact, 1=partial, 0=none), 2. ML probability, 3. Days since last
      const locA = a.locationPriority || 0;
      const locB = b.locationPriority || 0;
      if (locA !== locB) {
        return locB - locA; // Higher location priority first
      }
      if (Math.abs(a.probability - b.probability) > 0.05) {
        return b.probability - a.probability;
      }
      return b.monthsSinceLast - a.monthsSinceLast;
    });

  const handleSendEmails = async () => {
    if (!window.confirm(`Send email notification to ${filteredPredictions.length} donors?`)) return;
    
    try {
      const donorIds = filteredPredictions.map(p => p.donorId);
      const message = `We hope this message finds you in good health!\n\n` +
        `We are organizing a Blood Donation Camp and your participation can save lives. ` +
        `Your generous contribution of blood can make a significant difference to patients in need.\n\n` +
        `📅 Event Details:\n` +
        `Date: ${event.eventDate}\n` +
        `Venue: ${event.location}\n\n` +
        `✨ Why Donate Blood?\n` +
        `• Save up to 3 lives with one donation\n` +
        `• Free health checkup\n` +
        `• Refreshments provided\n` +
        `• Certificate of appreciation\n\n` +
        `Please come and be a hero! Every drop counts.\n\n` +
        `Thank you for your continued support!`;
      
      await axios.post('http://localhost:8080/api/notifications/send-email', {
        donorIds,
        subject: `🩸 Blood Donation Alert - ${event.name}`,
        message
      });
      alert('✅ Email notifications sent successfully!');
    } catch (error) {
      alert('❌ Failed to send emails: ' + error.message);
    }
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border"></div></div>;

  return (
    <div className="container-fluid mt-4">
      <div className="row">
        <div className="col-12">
          <button className="btn btn-secondary mb-3" onClick={() => navigate('/events')}>
            <i className="fas fa-arrow-left"></i> Back to Events
          </button>

          <div className="card mb-4">
            <div className="card-header bg-primary text-white">
              <h4><i className="fas fa-brain"></i> ML Predictions for Event: {event?.name}</h4>
              <small>Using Machine Learning to predict donor eligibility</small>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-3">
                  <p><strong><i className="fas fa-map-marker-alt"></i> Location:</strong><br/>{event?.location}</p>
                  <p><strong><i className="fas fa-calendar"></i> Date:</strong><br/>{event?.eventDate}</p>
                </div>
                <div className="col-md-3">
                  <div className="text-center">
                    <h2 className="text-success">{filteredPredictions.length}</h2>
                    <p className="text-muted">Total Eligible</p>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="text-center">
                    <h2 className="text-info">{filteredPredictions.filter(p => p.locationMatch).length}</h2>
                    <p className="text-muted">Near Location</p>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="text-center">
                    <h2 className="text-warning">{filteredPredictions.filter(p => p.probability >= 0.8).length}</h2>
                    <p className="text-muted">High Probability (80%+)</p>
                  </div>
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-12 text-center">
                  <button 
                    className="btn btn-primary btn-lg"
                    onClick={handleSendEmails}
                    disabled={filteredPredictions.length === 0}
                  >
                    <i className="fas fa-envelope"></i> Send Email to All Eligible Donors ({filteredPredictions.length})
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="card mb-4">
            <div className="card-body">
              <div className="row">
                <div className="col-md-4">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by name..."
                    value={filterName}
                    onChange={(e) => setFilterName(e.target.value)}
                  />
                </div>
                <div className="col-md-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Filter by location..."
                    value={filterLocation}
                    onChange={(e) => setFilterLocation(e.target.value)}
                  />
                </div>
                <div className="col-md-3">
                  <select className="form-control" value={filterBloodGroup} onChange={(e) => setFilterBloodGroup(e.target.value)}>
                    <option value="">All Blood Groups</option>
                    <option value="A_POSITIVE">A+</option>
                    <option value="A_NEGATIVE">A-</option>
                    <option value="B_POSITIVE">B+</option>
                    <option value="B_NEGATIVE">B-</option>
                    <option value="AB_POSITIVE">AB+</option>
                    <option value="AB_NEGATIVE">AB-</option>
                    <option value="O_POSITIVE">O+</option>
                    <option value="O_NEGATIVE">O-</option>
                  </select>
                </div>
                <div className="col-md-2">
                  <button className="btn btn-outline-secondary w-100" onClick={() => { setFilterName(''); setFilterLocation(''); setFilterBloodGroup(''); }}>
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header bg-success text-white">
              <h5><i className="fas fa-check-circle"></i> ML Predicted Eligible Donors ({filteredPredictions.length})</h5>
              <small>
                <i className="fas fa-sort"></i> Sorted by: Location proximity → ML probability → Days since last donation
                <br/>
                <span className="badge bg-light text-dark mt-1"><i className="fas fa-map-marker-alt"></i> Green rows = Near event location</span>
              </small>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Donor Name</th>
                      <th>Blood Group</th>
                      <th>Location</th>
                      <th>ML Probability</th>
                      <th>Days Since Last</th>
                      <th>Health Notes</th>
                      <th>Contact</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPredictions.map((pred, idx) => (
                      <tr key={idx} className={pred.locationMatch ? 'table-success' : ''}>
                        <td>
                          <strong>#{idx + 1}</strong>
                          {pred.locationMatch && <><br/><span className="badge bg-success"><i className="fas fa-map-marker-alt"></i> Near</span></>}
                        </td>
                        <td>
                          <strong>{pred.donorName}</strong>
                          <br/>
                          {pred.isNewDonor && <span className="badge bg-info"><i className="fas fa-star"></i> New Donor</span>}
                          {pred.isSmoker && <span className="badge bg-warning text-dark ms-1"><i className="fas fa-smoking"></i> Smoker</span>}
                          {pred.isAlcoholic && <span className="badge bg-warning text-dark ms-1"><i className="fas fa-wine-bottle"></i> Alcoholic</span>}
                        </td>
                        <td><span className="badge bg-danger">{pred.bloodGroup?.replace('_', '')}</span></td>
                        <td>
                          <small>{pred.location || 'N/A'}</small>
                        </td>
                        <td>
                          <div className="progress" style={{height: '25px', minWidth: '120px'}}>
                            <div 
                              className={`progress-bar ${pred.probability >= 0.8 ? 'bg-success' : pred.probability >= 0.6 ? 'bg-info' : 'bg-warning'}`}
                              style={{width: `${pred.probability * 100}%`}}
                            >
                              {(pred.probability * 100).toFixed(1)}%
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="badge bg-info">{pred.monthsSinceLast || 0} months</span>
                          <br/>
                          <small className="text-muted">({pred.daysSinceLast || 0} days)</small>
                        </td>
                        <td>
                          {pred.isNewDonor && <small className="text-info"><i className="fas fa-flask"></i> Lab tests required</small>}
                          {!pred.isNewDonor && pred.isSmoker && <small className="text-warning">🚭 Avoid smoking 24h before</small>}
                          {!pred.isNewDonor && pred.isSmoker && pred.isAlcoholic && <br/>}
                          {!pred.isNewDonor && pred.isAlcoholic && <small className="text-warning">🍺 Avoid alcohol 24h before</small>}
                          {!pred.isNewDonor && !pred.isSmoker && !pred.isAlcoholic && <small className="text-success">✓ No restrictions</small>}
                        </td>
                        <td>
                          <small>{pred.email}</small>
                          <br/>
                          <small>{pred.contactNumber}</small>
                        </td>
                        <td>
                          <button 
                            className="btn btn-sm btn-primary"
                            onClick={() => navigate(`/donors/profile/${pred.donorId}`)}
                          >
                            <i className="fas fa-eye"></i> View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDonorPredict;
