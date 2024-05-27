// DroneManagement.js
import React, { useState } from 'react';
import DroneDetails from './DroneDetails';
import DronesInUse from './DronesInUse';
import TrackDrones from './TrackDrones'
import ChargingStaionSimulation from './ChargingStationSimulation'
import './DroneManagement.css';

export const DroneManagement = () => {
  const [selectedOption, setSelectedOption] = useState('droneDetails');

  const renderContent = () => {
    switch (selectedOption) {
      case 'droneDetails':
        return <DroneDetails />;
      case 'dronesInUse':
        return <DronesInUse />;
      case 'trackDrones':
        return <TrackDrones />
      case 'charging':
        return <ChargingStaionSimulation />
      default:
        return null;
    }
  };

  return (
    <div className="drone-management">
      <div className="menu">
        <button onClick={() => setSelectedOption('droneDetails')}>Drone Details</button>
        <button onClick={() => setSelectedOption('dronesInUse')}>Drones In Use</button>
        <button onClick={() => setSelectedOption('trackDrones')}>Track Drones</button>
        <button onClick={() => setSelectedOption('charging')}>Power Stations</button>
        {/* <button onClick={() => setSelectedOption('dronesInUse')}>Charging Stations</button> */}
      </div>
      <div className="content">
        {renderContent()}
      </div>
    </div>
  );
};

