import React from 'react';

const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div className="loading-spinner">
      <div className="text-center">
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2 text-muted">{message}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;