import React, { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, doc, query, where } from 'firebase/firestore';
import { firestore } from './../../firebase';
import PopupMessage from './PopupMessage';
import './DroneManagement.css';

const DronesInUse = () => {
  const [dronesInUse, setDronesInUse] = useState([]);
  const [droneDetails, setDroneDetails] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const circulatingDronesQuery = query(
        collection(firestore, 'circulating_drones'),
        where('available', '==', true)
      );
      const circulatingDronesQuerySnapshot = await getDocs(circulatingDronesQuery);
      const circulatingDronesData = circulatingDronesQuerySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.data().id.id.split('/').pop(), // Extract the document ID from the reference path
        docId: doc.id // Store the document ID of circulating_drones
      }));
      setDronesInUse(circulatingDronesData);

      const droneDetailsQuerySnapshot = await getDocs(collection(firestore, 'drone_details'));
      const droneDetailsData = droneDetailsQuerySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setDroneDetails(droneDetailsData);
    };
    fetchData();
  }, []);

  const handleEdit = (docId, field, value) => {
    setDronesInUse(dronesInUse.map(drone => 
      drone.docId === docId ? { ...drone, [field]: value } : drone
    ));
  };

  const handleSave = async (docId) => {
    try {
      const drone = dronesInUse.find(d => d.docId === docId);

      const droneRef = doc(firestore, 'drone_details', drone.id);
      const droneDataToSave = {
        ...drone,
        id: droneRef,
      };

      delete droneDataToSave.docId;

      const circulatingDroneRef = doc(firestore, 'circulating_drones', docId);
      await updateDoc(circulatingDroneRef, droneDataToSave);

      setMessage('Update successful!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(`Error updating document: ${error.message}`);
    }
  };

  const handleRemoveFromCirculation = async (docId) => {
    try {
      const circulatingDroneRef = doc(firestore, 'circulating_drones', docId);
      await updateDoc(circulatingDroneRef, { available: false });

      setDronesInUse(dronesInUse.filter(d => d.docId !== docId));

      setMessage('Drone removed from circulation!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(`Error updating document: ${error.message}`);
    }
  };

  const displayValue = (value) => (value === null || value === undefined ? 'N/A' : value);

  return (
    <div>
      <PopupMessage message={message} onClose={() => setMessage('')} />
      <table>
        <thead>
          <tr>
            <th>Drone ID</th>
            <th>Assigned</th>
            <th>Charging Status</th>
            <th>Current Location</th>
            <th>Remaining Battery</th>            
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {dronesInUse.map(drone => (
            <tr key={drone.docId}>
              <td>
                {drone.id}
              </td>
              <td>
                <input
                  type="checkbox"
                  checked={drone.assigned || false}
                  onChange={(e) => handleEdit(drone.docId, 'assigned', e.target.checked)}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  checked={drone.charging_status || false}
                  onChange={(e) => handleEdit(drone.docId, 'charging_status', e.target.checked)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={displayValue(`Lat: ${drone.current_loc?.latitude}, Lng: ${drone.current_loc?.longitude}`)}
                  readOnly
                />
              </td>
              <td>
                <input
                  type="number"
                  value={displayValue(drone.remaining_battery)}
                  onChange={(e) => handleEdit(drone.docId, 'remaining_battery', e.target.value)}
                />
              </td>
              <td>
                <button className="table-button save-button" onClick={() => handleSave(drone.docId)}>Save</button>
                <button className="table-button remove-button" onClick={() => handleRemoveFromCirculation(drone.docId)}>Recall</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DronesInUse;
