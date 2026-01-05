import React, { useState } from 'react';
import axios from 'axios';

const BulkOperations = ({ selectedDonors, allDonors }) => {
  const [showModal, setShowModal] = useState(false);
  const [operation, setOperation] = useState('');

  const handleExport = () => {
    const donors = selectedDonors.length > 0 ? selectedDonors : allDonors;
    const csv = [
      ['Name', 'Age', 'Gender', 'Blood Group', 'Phone', 'Email', 'Total Donations', 'Last Donation'],
      ...donors.map(d => [
        d.name, d.age, d.gender, d.bloodGroup, d.contactNumber, d.email, 
        d.totalDonations, d.lastDonationDate || 'Never'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `donors_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const handleSendEmail = () => {
    setOperation('email');
    setShowModal(true);
  };

  const confirmOperation = async () => {
    const donors = selectedDonors.length > 0 ? selectedDonors : allDonors;
    const donorIds = donors.map(d => d.id);
    
    try {
      await axios.post('http://localhost:8080/api/notifications/send-email', {
        donorIds,
        subject: 'Blood Donation Request - Your Help Needed',
        message: 'You are eligible to donate blood. Your donation can save lives. Please consider donating blood at our center. Thank you for your support!'
      });
      
      alert(`✅ Email sent to ${donors.length} donors successfully!`);
    } catch (error) {
      alert('❌ Failed to send emails: ' + error.message);
    }
    
    setShowModal(false);
  };

  return (
    <div className="card shadow mb-4">
      <div className="card-header bg-primary text-white">
        <h5 className="mb-0"><i className="fas fa-tasks"></i> Bulk Operations</h5>
      </div>
      <div className="card-body">
        <div className="d-flex gap-2 flex-wrap">
          <button className="btn btn-success" onClick={handleExport}>
            <i className="fas fa-file-export"></i> Export to CSV
          </button>
          <button className="btn btn-primary" onClick={handleSendEmail}>
            <i className="fas fa-envelope"></i> Send Email to {selectedDonors.length > 0 ? 'Selected' : 'All'}
          </button>
          <span className="badge bg-secondary align-self-center ms-2">
            {selectedDonors.length > 0 ? `${selectedDonors.length} selected` : `All ${allDonors.length} donors`}
          </span>
        </div>
      </div>

      {showModal && (
        <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Email</h5>
                <button className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>Send email to {selectedDonors.length > 0 ? selectedDonors.length : allDonors.length} donors?</p>
                <p className="text-muted">Message: "You are eligible to donate blood. Your donation can save lives. Please consider donating blood at our center. Thank you for your support!"</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={confirmOperation}>Send</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkOperations;
