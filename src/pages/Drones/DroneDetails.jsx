import React, { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, doc, addDoc, query, where, GeoPoint } from 'firebase/firestore';
import { firestore } from './../../firebase';
import PopupMessage from './PopupMessage';
import './DroneManagement.css';

const DroneDetails = () => {
  const [droneDetails, setDroneDetails] = useState([]);
  const [message, setMessage] = useState('');
  const [showAddDroneCard, setShowAddDroneCard] = useState(false);
  const [newDroneData, setNewDroneData] = useState({
    battery_capacity: '',
    fly_time: '',
    id: '',
    in_use: true,
    model: '',
    remaining_battery: '100',
    speed: 0
  });

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

  const handleAddToCirculation = async (id) => {
    try {
      const drone = droneDetails.find(d => d.id === id);
      const circulatingDronesRef = collection(firestore, 'circulating_drones');
      const droneRef = doc(firestore, 'drone_details', id);

      const q = query(circulatingDronesRef, where('id', '==', droneRef));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const existingDroneDoc = querySnapshot.docs[0];
        const existingDroneData = existingDroneDoc.data();

        if (existingDroneData.available) {
          setMessage('Drone already in circulation');
        } else {
          await updateDoc(existingDroneDoc.ref, { available: true });
          setMessage('Drone added to circulation');
        }
      } else {
        await addDoc(circulatingDronesRef, {
          assigned: false,
          available: true,
          charging_status: false,
          current_loc: new GeoPoint(0, 0),
          id: droneRef,
          remaining_battery: 100,
        });
        setMessage('Drone added to circulation');
      }

      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(`Error adding drone to circulation: ${error.message}`);
    }
  };

  const displayValue = (value) => (value === null || value === undefined ? 'N/A' : value);

  const handleInputChange = (field, value) => {
    setNewDroneData({ ...newDroneData, [field]: value });
  };

  const handleAddNewDrone = async () => {
    try {
      const docRef = await addDoc(collection(firestore, 'drone_details'), newDroneData);
      setMessage('New drone added successfully!');
      setShowAddDroneCard(false);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(`Error adding new drone: ${error.message}`);
    }
  };

  return (
    <div>
      <PopupMessage message={message} onClose={() => setMessage('')} />
      <button className="table-button add-button" onClick={() => setShowAddDroneCard(true)}>Add New Drone</button>
      {showAddDroneCard && (
        <div className="popup-container">
          <div className="popup-card">
          <label htmlFor="battery_capacity">Battery Capacity (Ah)</label>
          <input
            type="text"
            value={newDroneData.battery_capacity}
            onChange={(e) => handleInputChange('battery_capacity', e.target.value)}
          />
          <br />
          <label htmlFor="fly_time">Fly Time (hours)</label>
          <input
            type="text"
            value={newDroneData.fly_time}
            onChange={(e) => handleInputChange('fly_time', e.target.value)}
          />
          <br/>
          {<label htmlFor="Capacity">Capacity (g)</label> }
          {<input
            type="text"
            value={newDroneData.id}
            onChange={(e) => handleInputChange('id', e.target.value)}
          /> }
          <br/>
          <label htmlFor="in_use">In Use</label>
          <input
            type="checkbox"
            checked={newDroneData.in_use}
            onChange={(e) => handleInputChange('in_use', e.target.checked)}
          />
          <br/>
          <label htmlFor="model">Model Number</label>
          <input
            type="text"
            value={newDroneData.model}
            onChange={(e) => handleInputChange('model', e.target.value)}
          />
          <br/>
          <label htmlFor="remaining_battery">Battery</label>
          <input
            type="text"
            value={newDroneData.remaining_battery}
            placeholder="Remaining Battery (%)"
            onChange={(e) => handleInputChange('remaining_battery', e.target.value)}
          />
          <br/>
          <label htmlFor="speed">Speed mph</label>
          <input
            type="number"
            value={newDroneData.speed}
            placeholder="Speed"
            onChange={(e) => handleInputChange('speed', e.target.value)}
          />
          <br/>
          <button onClick={handleAddNewDrone}>Add New Drone</button>
          <button onClick={() => setShowAddDroneCard(false)}>Cancel</button>
          </div>
          
        </div>
      )}
      <table>
        <thead>
          <tr>
            <th>Drone ID</th>
            <th>Battery Capacity</th>
            <th>Capacity</th>
            <th>Fly Time</th>
            <th>In Use</th>
            <th>Model</th>
            <th>Actions</th>
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
                  type="text"
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
                <button className="table-button save-button" onClick={() => handleSave(drone.id)}>Save</button>
                <button className="table-button add-button" onClick={() => handleAddToCirculation(drone.id)}>Add to circulation</button>
              </td>
              </tr>
        ))}
        </tbody>
      </table>
  </div>
  );
};

export default DroneDetails;
