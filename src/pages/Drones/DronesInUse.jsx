import React, { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { firestore } from './../../firebase';
import PopupMessage from './PopupMessage'; // Import the PopupMessage component

const DronesInUse = () => {
  const [dronesInUse, setDronesInUse] = useState([]);
  const [droneDetails, setDroneDetails] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const circulatingDronesQuerySnapshot = await getDocs(collection(firestore, 'circulating_drones'));
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

      // Convert the selected ID to a Firestore reference
      const droneRef = doc(firestore, 'drone_details', drone.id);
      const droneDataToSave = {
        ...drone,
        id: droneRef, // Save the reference instead of the plain ID
      };

      delete droneDataToSave.docId; // Remove the local docId before saving

      const circulatingDroneRef = doc(firestore, 'circulating_drones', docId);
      await updateDoc(circulatingDroneRef, droneDataToSave);

      setMessage('Update successful!');
      setTimeout(() => setMessage(''), 3000); // Clear the message after 3 seconds
    } catch (error) {
      setMessage(`Error updating document: ${error.message}`);
    }
  };

  const handleRemoveFromCirculation = async (docId) => {
    try {
      const circulatingDroneRef = doc(firestore, 'circulating_drones', docId);
      await updateDoc(circulatingDroneRef, { available: false });

      setDronesInUse(dronesInUse.map(d =>
        d.docId === docId ? { ...d, available: false } : d
      ));

      setMessage('Drone removed from circulation!');
      setTimeout(() => setMessage(''), 3000); // Clear the message after 3 seconds
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
            <th>Assigned</th>
            <th>Charging Status</th>
            <th>Current Location</th>
            <th>Remaining Battery</th>
            <th>Drone ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {dronesInUse.map(drone => (
            <tr key={drone.docId}>
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
                <select
                  value={drone.id}
                  onChange={(e) => handleEdit(drone.docId, 'id', e.target.value)}
                >
                  <option value="">Select Drone</option>
                  {droneDetails.map(droneDetail => (
                    <option key={droneDetail.id} value={droneDetail.id}>
                      {droneDetail.id}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <button onClick={() => handleSave(drone.docId)}>Save</button>
                <button onClick={() => handleRemoveFromCirculation(drone.docId)}>Remove from circulation</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DronesInUse;
