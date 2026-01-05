import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { donorAPI, mlAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const DonorForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'MALE',
    bloodGroup: 'A_POSITIVE',
    weight: '',
    height: '',
    contactNumber: '',
    email: '',
    address: '',
    totalDonations: 0,
    lastDonationDate: '',
    monthsSinceLast: 0,
    hemoglobinLevel: '',
    bloodPressureSystolic: '',
    bloodPressureDiastolic: '',
    hasChronicDisease: false,
    chronicDiseaseDetails: '',
    onMedication: false,
    medicationDetails: '',
    lastTravelDate: '',
    travelHistory: '',
    isSmoker: false,
    isAlcoholic: false,
    fitnessLevel: 'MEDIUM'
  });
  
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [phoneCheckResult, setPhoneCheckResult] = useState(null);

  useEffect(() => {
    if (isEdit) {
      fetchDonor();
    }
  }, [id]);

  const fetchDonor = async () => {
    try {
      setLoading(true);
      const response = await donorAPI.getById(id);
      const donor = response.data;
      
      // Format dates for input fields
      const formattedData = { ...donor };
      if (donor.lastDonationDate) {
        formattedData.lastDonationDate = donor.lastDonationDate.split('T')[0];
      }
      if (donor.lastTravelDate) {
        formattedData.lastTravelDate = donor.lastTravelDate.split('T')[0];
      }
      
      setFormData(formattedData);
    } catch (error) {
      setError('Failed to load donor data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Auto-calculate last donation date from months
    if (name === 'monthsSinceLast' && value) {
      const months = parseInt(value);
      const today = new Date();
      const lastDonationDate = new Date(today.setMonth(today.getMonth() - months));
      const formattedDate = lastDonationDate.toISOString().split('T')[0];
      
      setFormData(prev => ({
        ...prev,
        monthsSinceLast: value,
        lastDonationDate: formattedDate
      }));
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePhoneCheck = async () => {
    if (!formData.contactNumber || formData.contactNumber.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }
    
    try {
      setLoading(true);
      const response = await donorAPI.checkPhone(formData.contactNumber);
      setPhoneCheckResult(response.data);
      
      if (response.data.exists) {
        const donor = response.data.donor;
        setFormData({
          ...formData,
          name: donor.name,
          age: donor.age,
          gender: donor.gender,
          bloodGroup: donor.bloodGroup,
          weight: donor.weight,
          height: donor.height,
          email: donor.email,
          address: donor.address,
          totalDonations: donor.totalDonations + 1,
          monthsSinceLast: 0,
          hemoglobinLevel: donor.hemoglobinLevel,
          bloodPressureSystolic: donor.bloodPressureSystolic,
          bloodPressureDiastolic: donor.bloodPressureDiastolic,
          hasChronicDisease: donor.hasChronicDisease,
          onMedication: donor.onMedication,
          isSmoker: donor.isSmoker,
          isAlcoholic: donor.isAlcoholic,
          fitnessLevel: donor.fitnessLevel
        });
      }
    } catch (error) {
      setError('Failed to check phone number');
    } finally {
      setLoading(false);
    }
  };

  const handlePredict = async () => {
    try {
      setLoading(true);
      
      const predictionData = {
        months_since_last: parseInt(formData.monthsSinceLast) || 0,
        total_donations: parseInt(formData.totalDonations) || 0,
        age: parseInt(formData.age) || 0,
        hemoglobin_level: parseFloat(formData.hemoglobinLevel) || 0,
        weight: parseFloat(formData.weight) || 0,
        height: parseFloat(formData.height) || 0,
        has_chronic_disease: formData.hasChronicDisease,
        on_medication: formData.onMedication,
        is_smoker: formData.isSmoker,
        is_alcoholic: formData.isAlcoholic,
        fitness_level: formData.fitnessLevel,
        gender: formData.gender,
        blood_pressure_systolic: parseInt(formData.bloodPressureSystolic) || 120,
        blood_pressure_diastolic: parseInt(formData.bloodPressureDiastolic) || 80
      };

      const response = await mlAPI.predict(predictionData);
      setPrediction(response.data);
    } catch (error) {
      setError('Prediction failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      if (isEdit) {
        await donorAPI.update(id, formData);
      } else {
        await donorAPI.create(formData);
      }
      navigate('/donors');
    } catch (error) {
      setError('Failed to save donor: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading && isEdit) {
    return <LoadingSpinner message="Loading donor data..." />;
  }

  return (
    <div className="container-fluid mt-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1>{isEdit ? 'Edit Donor' : 'Add New Donor'}</h1>
            <button 
              className="btn btn-secondary"
              onClick={() => navigate('/donors')}
            >
              <i className="fas fa-arrow-left"></i> Back to Donors
            </button>
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {phoneCheckResult && (
            <div className={`alert ${phoneCheckResult.exists ? (phoneCheckResult.eligible ? 'alert-success' : 'alert-warning') : 'alert-info'}`}>
              <h5>
                <i className="fas fa-phone"></i> Phone Check Result
              </h5>
              <p><strong>{phoneCheckResult.message}</strong></p>
              {phoneCheckResult.exists && (
                <p className="mb-0">
                  <strong>Donor:</strong> {phoneCheckResult.donor.name} | 
                  <strong> Last Donation:</strong> {phoneCheckResult.donor.monthsSinceLast} months ago
                </p>
              )}
            </div>
          )}

          {prediction && (
            <div className={`alert ${prediction.label ? 'alert-success' : 'alert-warning'}`}>
              <h5>
                <i className="fas fa-chart-line"></i> Prediction Result
              </h5>
              <p><strong>Probability:</strong> {(prediction.probability * 100).toFixed(2)}%</p>
              <p><strong>Status:</strong> 
                <span className={`badge ${prediction.label ? 'bg-success' : 'bg-warning'} ms-2`}>
                  {prediction.label ? 'ELIGIBLE' : 'NOT ELIGIBLE'}
                </span>
              </p>
              <p><strong>Message:</strong> {prediction.message}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="row">
              {/* Personal Information */}
              <div className="col-md-6">
                <div className="card mb-4">
                  <div className="card-header bg-primary text-white">
                    <h5 className="mb-0">
                      <i className="fas fa-user"></i> Personal Information
                    </h5>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-12 mb-3">
                        <label className="form-label">Full Name *</label>
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
                        <label className="form-label">Age *</label>
                        <input
                          type="number"
                          className="form-control"
                          name="age"
                          value={formData.age}
                          onChange={handleChange}
                          min="18"
                          max="65"
                          required
                        />
                      </div>
                      
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Gender *</label>
                        <select
                          className="form-select"
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          required
                        >
                          <option value="MALE">Male</option>
                          <option value="FEMALE">Female</option>
                          <option value="OTHER">Other</option>
                        </select>
                      </div>

                      <div className="col-md-6 mb-3">
                        <label className="form-label">Blood Group *</label>
                        <select
                          className="form-select"
                          name="bloodGroup"
                          value={formData.bloodGroup}
                          onChange={handleChange}
                          required
                        >
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

                      <div className="col-md-6 mb-3">
                        <label className="form-label">Fitness Level</label>
                        <select
                          className="form-select"
                          name="fitnessLevel"
                          value={formData.fitnessLevel}
                          onChange={handleChange}
                        >
                          <option value="LOW">Low</option>
                          <option value="MEDIUM">Medium</option>
                          <option value="HIGH">High</option>
                        </select>
                      </div>

                      <div className="col-md-6 mb-3">
                        <label className="form-label">Weight (kg)</label>
                        <input
                          type="number"
                          step="0.1"
                          className="form-control"
                          name="weight"
                          value={formData.weight}
                          onChange={handleChange}
                          min="40"
                          max="150"
                        />
                      </div>

                      <div className="col-md-6 mb-3">
                        <label className="form-label">Height (cm)</label>
                        <input
                          type="number"
                          step="0.1"
                          className="form-control"
                          name="height"
                          value={formData.height}
                          onChange={handleChange}
                          min="140"
                          max="220"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="col-md-6">
                <div className="card mb-4">
                  <div className="card-header bg-info text-white">
                    <h5 className="mb-0">
                      <i className="fas fa-address-book"></i> Contact Information
                    </h5>
                  </div>
                  <div className="card-body">
                    <div className="mb-3">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Contact Number *</label>
                      <div className="input-group">
                        <input
                          type="tel"
                          className="form-control"
                          name="contactNumber"
                          value={formData.contactNumber}
                          onChange={handleChange}
                          placeholder="Enter 10-digit phone number"
                          required
                        />
                        <button 
                          type="button"
                          className="btn btn-primary"
                          onClick={handlePhoneCheck}
                          disabled={loading || !formData.contactNumber}
                        >
                          <i className="fas fa-search"></i> Check
                        </button>
                      </div>
                      <small className="text-muted">Check if donor exists and is eligible</small>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Address</label>
                      <textarea
                        className="form-control"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows="3"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Medical Information */}
            <div className="card mb-4">
              <div className="card-header bg-warning text-dark">
                <h5 className="mb-0">
                  <i className="fas fa-heartbeat"></i> Medical Information
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Hemoglobin Level (g/dL)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="form-control"
                      name="hemoglobinLevel"
                      value={formData.hemoglobinLevel}
                      onChange={handleChange}
                      min="10"
                      max="20"
                    />
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label">Blood Pressure (Systolic)</label>
                    <input
                      type="number"
                      className="form-control"
                      name="bloodPressureSystolic"
                      value={formData.bloodPressureSystolic}
                      onChange={handleChange}
                      min="80"
                      max="200"
                    />
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label">Blood Pressure (Diastolic)</label>
                    <input
                      type="number"
                      className="form-control"
                      name="bloodPressureDiastolic"
                      value={formData.bloodPressureDiastolic}
                      onChange={handleChange}
                      min="50"
                      max="120"
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-3 mb-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="hasChronicDisease"
                        checked={formData.hasChronicDisease}
                        onChange={handleChange}
                      />
                      <label className="form-check-label">Chronic Disease</label>
                    </div>
                  </div>

                  <div className="col-md-3 mb-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="onMedication"
                        checked={formData.onMedication}
                        onChange={handleChange}
                      />
                      <label className="form-check-label">On Medication</label>
                    </div>
                  </div>

                  <div className="col-md-3 mb-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="isSmoker"
                        checked={formData.isSmoker}
                        onChange={handleChange}
                      />
                      <label className="form-check-label">Smoker</label>
                    </div>
                  </div>

                  <div className="col-md-3 mb-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="isAlcoholic"
                        checked={formData.isAlcoholic}
                        onChange={handleChange}
                      />
                      <label className="form-check-label">Alcoholic</label>
                    </div>
                  </div>
                </div>

                {formData.hasChronicDisease && (
                  <div className="mb-3">
                    <label className="form-label">Chronic Disease Details</label>
                    <textarea
                      className="form-control"
                      name="chronicDiseaseDetails"
                      value={formData.chronicDiseaseDetails}
                      onChange={handleChange}
                      rows="2"
                      placeholder="Please specify chronic diseases..."
                    />
                  </div>
                )}

                {formData.onMedication && (
                  <div className="mb-3">
                    <label className="form-label">Medication Details</label>
                    <textarea
                      className="form-control"
                      name="medicationDetails"
                      value={formData.medicationDetails}
                      onChange={handleChange}
                      rows="2"
                      placeholder="Please specify medications..."
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Donation History */}
            <div className="card mb-4">
              <div className="card-header bg-success text-white">
                <h5 className="mb-0">
                  <i className="fas fa-history"></i> Donation History
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Total Donations</label>
                    <input
                      type="number"
                      className="form-control"
                      name="totalDonations"
                      value={formData.totalDonations}
                      onChange={handleChange}
                      min="0"
                    />
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label">Last Donation Date</label>
                    <input
                      type="date"
                      className="form-control"
                      name="lastDonationDate"
                      value={formData.lastDonationDate}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label">Months Since Last Donation</label>
                    <input
                      type="number"
                      className="form-control"
                      name="monthsSinceLast"
                      value={formData.monthsSinceLast}
                      onChange={handleChange}
                      min="0"
                      placeholder="Enter months (auto-sets date)"
                    />
                    <small className="text-muted">Date will be auto-calculated</small>
                  </div>
                </div>
              </div>
            </div>

            {/* Travel History */}
            <div className="card mb-4">
              <div className="card-header bg-secondary text-white">
                <h5 className="mb-0">
                  <i className="fas fa-plane"></i> Travel History
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Last Travel Date</label>
                    <input
                      type="date"
                      className="form-control"
                      name="lastTravelDate"
                      value={formData.lastTravelDate}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-12 mb-3">
                    <label className="form-label">Travel History Details</label>
                    <textarea
                      className="form-control"
                      name="travelHistory"
                      value={formData.travelHistory}
                      onChange={handleChange}
                      rows="2"
                      placeholder="Recent travel destinations and dates..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="d-flex gap-2 justify-content-end">
              <button 
                type="button" 
                className="btn btn-info"
                onClick={handlePredict}
                disabled={loading || !formData.age || !formData.weight}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Predicting...
                  </>
                ) : (
                  <>
                    <i className="fas fa-chart-line me-2"></i>
                    Predict Eligibility
                  </>
                )}
              </button>
              
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
                    {isEdit ? 'Update Donor' : 'Add Donor'}
                  </>
                )}
              </button>
              
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => navigate('/donors')}
              >
                <i className="fas fa-times me-2"></i>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DonorForm;