// DroneDetails.js
import React, { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { firestore } from './../../firebase';
import PopupMessage from './PopupMessage';



const DroneDetails = () => {
  const [droneDetails, setDroneDetails] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(firestore, 'drone_details'));
      const data = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setDroneDetails(data);
    };
    fetchData();
  }, []);

  const handleEdit = (id, field, value) => {
    setDroneDetails(droneDetails.map(drone => 
      drone.id === id ? { ...drone, [field]: value } : drone
    ));
  };

  const handleSave = async (id) => {
    const drone = droneDetails.find(d => d.id === id);
    const droneRef = doc(firestore, 'drone_details', id);
    await updateDoc(droneRef, drone);  

    setMessage('Update successful!');
    setTimeout(() => setMessage(''), 3000); // Clear the message after 3 seconds
  };

  const displayValue = (value) => (value === null || value === undefined ? 'N/A' : value);

  return (
    <div>
      <PopupMessage message={message} onClose={() => setMessage('')} />
      <table>
      <thead>
        <tr>
          <th>Drone ID</th>  
          <th>Battery Capacity</th>
          <th>Capacity</th>
          <th>Fly Time</th>
          <th>In Use</th>
          <th>Model</th>
          <th colSpan={2}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {droneDetails.map(drone => (
          <tr key={drone.id}>
            <td>{drone.id}</td>
            <td>
              <input
                type="text"
                value={displayValue(drone.battery_capacity)}
                onChange={(e) => handleEdit(drone.id, 'battery_capacity', e.target.value)}
              />
            </td>
            <td>
              <input
                type="number"
                value={displayValue(drone.capacity)}
                onChange={(e) => handleEdit(drone.id, 'capacity', e.target.value)}
              />
            </td>
            <td>
              <input
                type="text"
                value={displayValue(drone.fly_time)}
                onChange={(e) => handleEdit(drone.id, 'fly_time', e.target.value)}
              />
            </td>
            <td>
              <input
                type="checkbox"
                checked={drone.in_use || false}
                onChange={(e) => handleEdit(drone.id, 'in_use', e.target.checked)}
              />
            </td>
            <td>
              <input
                type="text"
                value={displayValue(drone.model)}
                onChange={(e) => handleEdit(drone.id, 'model', e.target.value)}
              />
            </td>
            <td>
              <button onClick={() => handleSave(drone.id)}>Save</button>             
            </td>
            <td>Add to circulation</td>
            
          </tr>
        ))}
      </tbody>
    </table>
    </div>
    
  );
};


export default DroneDetails;