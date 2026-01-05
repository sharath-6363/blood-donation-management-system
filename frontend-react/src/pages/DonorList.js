import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { donorAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import BulkOperations from '../components/BulkOperations';
import axios from 'axios';

const DonorList = () => {
  const [searchParams] = useSearchParams();
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBloodGroup, setFilterBloodGroup] = useState('');
  const [selectedDonors, setSelectedDonors] = useState([]);
  const [showEligibleOnly, setShowEligibleOnly] = useState(searchParams.get('filter') === 'eligible');

  const toggleSelectDonor = (donor) => {
    setSelectedDonors(prev => 
      prev.find(d => d.id === donor.id) 
        ? prev.filter(d => d.id !== donor.id)
        : [...prev, donor]
    );
  };

  const toggleSelectAll = () => {
    setSelectedDonors(prev => 
      prev.length === filteredDonors.length ? [] : filteredDonors
    );
  };

  useEffect(() => {
    fetchDonors();
  }, []);

  const fetchDonors = async () => {
    try {
      const response = await donorAPI.getAll();
      setDonors(response.data);
    } catch (error) {
      setError('Failed to load donors');
      console.error('Error fetching donors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this donor?')) {
      try {
        await donorAPI.delete(id);
        setDonors(donors.filter(donor => donor.id !== id));
      } catch (error) {
        setError('Failed to delete donor');
      }
    }
  };

  const handlePredict = async (donorId) => {
    try {
      const response = await donorAPI.predict(donorId);
      const prob = (response.data.probability * 100).toFixed(1);
      const eligible = response.data.label;
      const message = eligible 
        ? `✅ ML PREDICTION: ELIGIBLE\n\nProbability: ${prob}%\n\nThis donor is predicted to be suitable for blood donation based on ML analysis of health parameters.`
        : `❌ ML PREDICTION: NOT ELIGIBLE\n\nProbability: ${prob}%\n\nML model suggests this donor may not be suitable for donation at this time.`;
      alert(message);
    } catch (error) {
      alert('❌ ML Prediction failed\n\nMake sure ML service is running:\n1. cd ml-service\n2. python app.py\n\nError: ' + error.message);
    }
  };

  const handleSendEmail = async (donor) => {
    const customMessage = prompt(
      `Send email to ${donor.name} (${donor.email})\n\n` +
      `Enter custom message (or leave empty for default message):`
    );
    
    if (customMessage === null) return; // User cancelled
    
    const message = customMessage.trim() || 
      `We hope this message finds you in good health!\n\n` +
      `We need your help! Your generous contribution of blood can make a significant difference to patients in need.\n\n` +
      `✨ Why Donate Blood?\n` +
      `• Save up to 3 lives with one donation\n` +
      `• Free health checkup\n` +
      `• Refreshments provided\n` +
      `• Certificate of appreciation\n\n` +
      `Please consider donating blood. Every drop counts!\n\n` +
      `Thank you for your support!`;
    
    try {
      const response = await axios.post('http://localhost:8080/api/notifications/send-email', {
        donorIds: [donor.id],
        subject: '🩸 Blood Donation Request',
        message
      });
      
      if (response.data.success && response.data.failed === 0) {
        alert('✅ Email sent successfully!');
      } else if (response.data.failed > 0) {
        alert('❌ Failed to send email. Please check email configuration.');
      } else {
        alert('✅ Email sent successfully!');
      }
    } catch (error) {
      alert('❌ Failed to send email. Server error or email service not configured.');
    }
  };

  const filteredDonors = donors.filter(donor => {
    const matchesSearch = donor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (donor.email && donor.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesBloodGroup = !filterBloodGroup || donor.bloodGroup === filterBloodGroup;
    
    // Determine eligibility
    const isNewDonor = !donor.totalDonations || donor.totalDonations === 0;
    let isEligible;
    
    if (isNewDonor) {
      // New donor - only basic criteria
      isEligible = donor.age >= 18 && donor.age <= 65 && donor.weight >= 50;
    } else {
      // Existing donor - full health check
      const basicEligible = donor.monthsSinceLast >= 3 && donor.age >= 18 && donor.age <= 65;
      const hasHealthData = donor.hemoglobinLevel && donor.weight && donor.bloodPressureSystolic && donor.bloodPressureDiastolic;
      const healthEligible = hasHealthData &&
        (donor.hemoglobinLevel >= 12.5 && donor.hemoglobinLevel <= 17.5) &&
        (donor.weight >= 50) &&
        (donor.bloodPressureSystolic >= 90 && donor.bloodPressureSystolic <= 180) &&
        (donor.bloodPressureDiastolic >= 50 && donor.bloodPressureDiastolic <= 100) &&
        !donor.hasChronicDisease;
      isEligible = basicEligible && healthEligible;
    }
    
    const matchesEligibility = !showEligibleOnly || isEligible;
    return matchesSearch && matchesBloodGroup && matchesEligibility;
  });

  const getEligibilityBadge = (donor) => {
    // New donor (0 donations) - only check basic criteria
    const isNewDonor = !donor.totalDonations || donor.totalDonations === 0;
    
    if (isNewDonor) {
      const basicEligible = donor.age >= 18 && donor.age <= 65 && donor.weight >= 50;
      if (basicEligible) {
        return <span className="badge bg-info">New Donor - Lab Test Required</span>;
      }
      return <span className="badge bg-danger">Not Eligible</span>;
    }
    
    // Existing donor - full health check
    const basicEligible = donor.monthsSinceLast >= 3 && donor.age >= 18 && donor.age <= 65;
    
    const hasHealthData = donor.hemoglobinLevel && donor.weight && donor.bloodPressureSystolic && donor.bloodPressureDiastolic;
    
    if (!hasHealthData) {
      return <span className="badge bg-secondary">Incomplete Data</span>;
    }
    
    const healthEligible = 
      (donor.hemoglobinLevel >= 12.5 && donor.hemoglobinLevel <= 17.5) &&
      (donor.weight >= 50) &&
      (donor.bloodPressureSystolic >= 90 && donor.bloodPressureSystolic <= 180) &&
      (donor.bloodPressureDiastolic >= 50 && donor.bloodPressureDiastolic <= 100) &&
      !donor.hasChronicDisease;
    
    if (basicEligible && healthEligible) {
      if (donor.isSmoker || donor.isAlcoholic) {
        return <span className="badge bg-warning">Eligible (Caution)</span>;
      }
      return <span className="badge bg-success">Eligible</span>;
    }
    return <span className="badge bg-danger">Not Eligible</span>;
  };

  const getBloodGroupDisplay = (bloodGroup) => {
    return bloodGroup.replace('_', '');
  };

  if (loading) {
    return <LoadingSpinner message="Loading donors..." />;
  }

  return (
    <div className="container-fluid mt-4 px-4">
      <div className="row">
        <div className="col-12">
          {/* Page Header */}
          <div className="card border-0 shadow-sm mb-4" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
            <div className="card-body py-4">
              <div className="row align-items-center">
                <div className="col-md-8">
                  <h2 className="text-white mb-2 fw-bold">
                    <i className="fas fa-users me-2"></i>
                    Donor Management
                  </h2>
                  <p className="text-white mb-0 opacity-75">
                    Manage and track all blood donors
                    {showEligibleOnly && <span className="badge bg-light text-dark ms-2"><i className="fas fa-filter me-1"></i>Showing Eligible Only</span>}
                  </p>
                </div>
                <div className="col-md-4 text-md-end mt-3 mt-md-0">
                  <button 
                    className={`btn ${showEligibleOnly ? 'btn-light' : 'btn-outline-light'} me-2`}
                    onClick={() => setShowEligibleOnly(!showEligibleOnly)}
                  >
                    <i className="fas fa-filter me-1"></i>{showEligibleOnly ? 'Show All' : 'Eligible Only'}
                  </button>
                  <Link to="/donors/new" className="btn btn-light">
                    <i className="fas fa-user-plus me-1"></i>Add Donor
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

          <BulkOperations selectedDonors={selectedDonors} allDonors={filteredDonors} />

          {/* Search & Filter Card */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white border-0 py-3">
              <h5 className="mb-0 fw-bold text-dark">
                <i className="fas fa-search me-2 text-primary"></i>
                Search & Filter
              </h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-5">
                  <div className="input-group">
                    <span className="input-group-text bg-light border-0">
                      <i className="fas fa-search text-muted"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control border-0 bg-light"
                      placeholder="Search by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="input-group">
                    <span className="input-group-text bg-light border-0">
                      <i className="fas fa-tint text-danger"></i>
                    </span>
                    <select
                      className="form-select border-0 bg-light"
                      value={filterBloodGroup}
                      onChange={(e) => setFilterBloodGroup(e.target.value)}
                    >
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
                </div>
                <div className="col-md-3">
                  <button 
                    className="btn btn-outline-secondary w-100"
                    onClick={() => {
                      setSearchTerm('');
                      setFilterBloodGroup('');
                    }}
                  >
                    <i className="fas fa-times me-1"></i>Clear Filters
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Donors Table */}
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0 py-3">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-bold text-dark">
                  <i className="fas fa-list me-2 text-primary"></i>
                  Donors List
                </h5>
                <span className="badge bg-primary fs-6">{filteredDonors.length} Total</span>
              </div>
            </div>
            <div className="card-body">
              {filteredDonors.length === 0 ? (
                <div className="text-center py-4">
                  <i className="fas fa-users fa-3x text-muted mb-3"></i>
                  <p className="text-muted">No donors found</p>
                  <Link to="/donors/new" className="btn btn-primary">
                    Add First Donor
                  </Link>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th className="border-0 text-uppercase text-muted" style={{fontSize: '0.75rem', fontWeight: '600'}}>
                          <input type="checkbox" onChange={toggleSelectAll} checked={selectedDonors.length === filteredDonors.length && filteredDonors.length > 0} />
                        </th>
                        <th className="border-0 text-uppercase text-muted" style={{fontSize: '0.75rem', fontWeight: '600'}}>Name</th>
                        <th className="border-0 text-uppercase text-muted" style={{fontSize: '0.75rem', fontWeight: '600'}}>Age</th>
                        <th className="border-0 text-uppercase text-muted" style={{fontSize: '0.75rem', fontWeight: '600'}}>Gender</th>
                        <th className="border-0 text-uppercase text-muted" style={{fontSize: '0.75rem', fontWeight: '600'}}>Blood Group</th>
                        <th className="border-0 text-uppercase text-muted" style={{fontSize: '0.75rem', fontWeight: '600'}}>Donations</th>
                        <th className="border-0 text-uppercase text-muted" style={{fontSize: '0.75rem', fontWeight: '600'}}>Last Donation</th>
                        <th className="border-0 text-uppercase text-muted" style={{fontSize: '0.75rem', fontWeight: '600'}}>Status</th>
                        <th className="border-0 text-uppercase text-muted text-center" style={{fontSize: '0.75rem', fontWeight: '600'}}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDonors.map(donor => (
                        <tr key={donor.id}>
                          <td>
                            <input type="checkbox" checked={selectedDonors.find(d => d.id === donor.id)} onChange={() => toggleSelectDonor(donor)} />
                          </td>
                          <td>
                            <strong>{donor.name}</strong>
                            <br />
                            <small className="text-muted">{donor.email}</small>
                          </td>
                          <td>{donor.age}</td>
                          <td>{donor.gender}</td>
                          <td>
                            <span className={`badge bg-danger`}>
                              {getBloodGroupDisplay(donor.bloodGroup)}
                            </span>
                          </td>
                          <td>
                            <span className="badge bg-info">{donor.totalDonations}</span>
                          </td>
                          <td>
                            {donor.lastDonationDate ? 
                              new Date(donor.lastDonationDate).toLocaleDateString() : 
                              'Never'
                            }
                            <br />
                            <small className="text-muted">
                              {donor.monthsSinceLast} months ago
                            </small>
                          </td>
                          <td>{getEligibilityBadge(donor)}</td>
                          <td>
                            <div className="d-flex gap-1 justify-content-center">
                              <Link
                                to={`/donors/profile/${donor.id}`}
                                className="btn btn-sm btn-success rounded-circle"
                                style={{width: '35px', height: '35px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                                title="View"
                              >
                                <i className="fas fa-eye"></i>
                              </Link>
                              <button
                                className="btn btn-sm btn-primary rounded-circle"
                                style={{width: '35px', height: '35px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                                onClick={() => handleSendEmail(donor)}
                                title="Email"
                              >
                                <i className="fas fa-envelope"></i>
                              </button>
                              <button
                                className="btn btn-sm btn-info rounded-circle"
                                style={{width: '35px', height: '35px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                                onClick={() => handlePredict(donor.id)}
                                title="Predict"
                              >
                                <i className="fas fa-brain"></i>
                              </button>
                              <Link
                                to={`/donors/edit/${donor.id}`}
                                className="btn btn-sm btn-warning rounded-circle"
                                style={{width: '35px', height: '35px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                                title="Edit"
                              >
                                <i className="fas fa-edit"></i>
                              </Link>
                              <button
                                className="btn btn-sm btn-danger rounded-circle"
                                style={{width: '35px', height: '35px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                                onClick={() => handleDelete(donor.id)}
                                title="Delete"
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorList;