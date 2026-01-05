import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { donorAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const DonorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [donor, setDonor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDonor();
  }, [id]);

  const fetchDonor = async () => {
    try {
      const response = await donorAPI.getById(id);
      setDonor(response.data);
    } catch (error) {
      console.error('Error fetching donor:', error);
    } finally {
      setLoading(false);
    }
  };

  const getBloodTypeIcon = (bloodGroup) => {
    return <span className="badge bg-danger fs-4 px-3 py-2">{bloodGroup.replace('_', '')}</span>;
  };

  if (loading) return <LoadingSpinner />;
  if (!donor) return <div className="alert alert-danger">Donor not found</div>;

  return (
    <div className="container-fluid mt-4 px-4">
      <div className="row">
        <div className="col-12">
          {/* Page Header */}
          <div className="card border-0 shadow-sm mb-4" style={{background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'}}>
            <div className="card-body py-3">
              <div className="row align-items-center">
                <div className="col-md-8">
                  <h3 className="text-white mb-0 fw-bold">
                    <i className="fas fa-user-circle me-2"></i>
                    Donor Profile
                  </h3>
                </div>
                <div className="col-md-4 text-md-end mt-2 mt-md-0">
                  <Link to={`/donors/edit/${id}`} className="btn btn-light me-2">
                    <i className="fas fa-edit me-1"></i>Edit
                  </Link>
                  <button onClick={() => navigate('/donors')} className="btn btn-outline-light">
                    <i className="fas fa-arrow-left me-1"></i>Back
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Header */}
          <div className="card border-0 shadow-sm mb-4" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
            <div className="card-body text-white p-4">
              <div className="row align-items-center">
                <div className="col-md-2 text-center">
                  <div className="bg-white rounded-circle d-inline-flex align-items-center justify-content-center" 
                       style={{width: '100px', height: '100px'}}>
                    <i className="fas fa-user fa-3x text-primary"></i>
                  </div>
                </div>
                <div className="col-md-7">
                  <h2 className="mb-2">{donor.name}</h2>
                  <p className="mb-1"><i className="fas fa-phone"></i> {donor.contactNumber}</p>
                  <p className="mb-1"><i className="fas fa-envelope"></i> {donor.email}</p>
                  <p className="mb-0"><i className="fas fa-map-marker-alt"></i> {donor.address}</p>
                </div>
                <div className="col-md-3 text-center">
                  {getBloodTypeIcon(donor.bloodGroup)}
                  <div className="mt-3">
                    <span className={`badge ${donor.monthsSinceLast >= 3 ? 'bg-success' : 'bg-warning'} fs-6 px-3 py-2`}>
                      {donor.monthsSinceLast >= 3 ? 'ELIGIBLE' : 'NOT ELIGIBLE'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            {/* Personal Info */}
            <div className="col-md-6 mb-4">
              <div className="card shadow h-100">
                <div className="card-header bg-primary text-white">
                  <h5 className="mb-0"><i className="fas fa-id-card"></i> Personal Information</h5>
                </div>
                <div className="card-body">
                  <table className="table table-borderless">
                    <tbody>
                      <tr>
                        <td className="fw-bold">Age:</td>
                        <td>{donor.age} years</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Gender:</td>
                        <td>{donor.gender}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Weight:</td>
                        <td>{donor.weight} kg</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Height:</td>
                        <td>{donor.height} cm</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Fitness Level:</td>
                        <td><span className="badge bg-info">{donor.fitnessLevel}</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Medical Info */}
            <div className="col-md-6 mb-4">
              <div className="card shadow h-100">
                <div className="card-header bg-danger text-white">
                  <h5 className="mb-0"><i className="fas fa-heartbeat"></i> Medical Information</h5>
                </div>
                <div className="card-body">
                  <table className="table table-borderless">
                    <tbody>
                      <tr>
                        <td className="fw-bold">Hemoglobin:</td>
                        <td>{donor.hemoglobinLevel} g/dL</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Blood Pressure:</td>
                        <td>{donor.bloodPressureSystolic}/{donor.bloodPressureDiastolic} mmHg</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Chronic Disease:</td>
                        <td>{donor.hasChronicDisease ? <span className="badge bg-warning">Yes</span> : <span className="badge bg-success">No</span>}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">On Medication:</td>
                        <td>{donor.onMedication ? <span className="badge bg-warning">Yes</span> : <span className="badge bg-success">No</span>}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Smoker:</td>
                        <td>{donor.isSmoker ? <span className="badge bg-danger">Yes</span> : <span className="badge bg-success">No</span>}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Alcoholic:</td>
                        <td>{donor.isAlcoholic ? <span className="badge bg-danger">Yes</span> : <span className="badge bg-success">No</span>}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Donation History */}
            <div className="col-md-12 mb-4">
              <div className="card shadow">
                <div className="card-header bg-success text-white">
                  <h5 className="mb-0"><i className="fas fa-history"></i> Donation History</h5>
                </div>
                <div className="card-body">
                  <div className="row text-center">
                    <div className="col-md-4">
                      <div className="p-3">
                        <i className="fas fa-tint fa-3x text-danger mb-2"></i>
                        <h3 className="mb-0">{donor.totalDonations}</h3>
                        <p className="text-muted">Total Donations</p>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="p-3">
                        <i className="fas fa-calendar-alt fa-3x text-primary mb-2"></i>
                        <h3 className="mb-0">{donor.lastDonationDate ? new Date(donor.lastDonationDate).toLocaleDateString() : 'Never'}</h3>
                        <p className="text-muted">Last Donation</p>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="p-3">
                        <i className="fas fa-clock fa-3x text-warning mb-2"></i>
                        <h3 className="mb-0">{donor.monthsSinceLast}</h3>
                        <p className="text-muted">Months Since Last</p>
                      </div>
                    </div>
                  </div>
                  <div className="progress" style={{height: '30px'}}>
                    <div className="progress-bar bg-success" role="progressbar" 
                         style={{width: `${Math.min((donor.monthsSinceLast / 3) * 100, 100)}%`}}>
                      {donor.monthsSinceLast >= 3 ? 'Eligible to Donate' : `Wait ${3 - donor.monthsSinceLast} more months`}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorProfile;
