import React from 'react';
import './DroneManagement.css';

const PopupMessage = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="popup-message-overlay" onClick={onClose}>
      <div className="popup-message">
        <p>{message}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default PopupMessage;
