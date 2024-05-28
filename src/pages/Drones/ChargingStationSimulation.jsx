import React, { useState, useEffect } from 'react';
import { firestore } from './../../firebase';
import { collection, getDocs, doc, getDoc, updateDoc, query, where, addDoc } from 'firebase/firestore';
import { getDistance } from 'geolib';
import './DroneManagement.css';

const ChargingStationSimulation = () => {
    const [selectedDroneId, setSelectedDroneId] = useState('');
    const [remainingBattery, setRemainingBattery] = useState('');
    const [chargingStations, setChargingStations] = useState([]);
    const [drones, setDrones] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newStationData, setNewStationData] = useState({ id: '', location: { latitude: 0, longitude: 0 }, slots: [] });
    const [slotsInput, setSlotsInput] = useState('');

  useEffect(() => {
    const fetchChargingStations = async () => {
      const chargingStationsRef = collection(firestore, 'charging_station');
      const chargingStationsSnapshot = await getDocs(chargingStationsRef);
      const stations = chargingStationsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setChargingStations(stations);
    };

    const fetchDrones = async () => {
      const dronesRef = collection(firestore, 'circulating_drones');
      const dronesSnapshot = await getDocs(dronesRef);
      const dronesList = await Promise.all(dronesSnapshot.docs.map(async docSnapshot => {
        const droneData = docSnapshot.data();
        const droneId = droneData.id.path.split('/').pop();
        const droneDocRef = doc(firestore, 'circulating_drones', droneId);
        const droneDoc = await getDoc(droneDocRef);
        const resolvedDroneData = { id: droneDoc.id, ...droneDoc.data() };
        return resolvedDroneData;
      }));
      setDrones(dronesList);
    };

    fetchChargingStations();
    fetchDrones();
  }, []);

  const handleAssign = async () => {
    try {
      if (!selectedDroneId) {
        console.error('Please select a drone.');
        return;
      }

      console.log('id :', selectedDroneId);
      const circulatingDronesRef = collection(firestore, 'circulating_drones');
      const droneRef = query(circulatingDronesRef, where('id', '==', `drone_details/${selectedDroneId}`));
    // const droneRef = query(circulatingDronesRef, where('id', '==', selectedDroneId));
      const selectedDroneSnapshot = await getDocs(droneRef);

      console.log('circulatingDronesRef',circulatingDronesRef);
      console.log('droneRef',droneRef);
      console.log('selectedDroneSnapshot',selectedDroneSnapshot.empty);


      if (!selectedDroneSnapshot.empty) {
        const selectedDroneData = selectedDroneSnapshot.docs[0].data();
        const droneId = selectedDroneData.id.path.split('/').pop();
        const droneDocRef = doc(firestore, 'circulating_drones', droneId);

        console.log('Selected Drone ID:', droneId);
        console.log('Remaining Battery:', remainingBattery);
        console.log('Drone Reference:', droneDocRef);

        const droneSnapshot = await getDoc(droneDocRef);

        if (droneSnapshot.exists()) {
          const droneData = droneSnapshot.data();
          droneData.remaining_battery = remainingBattery;

          if (droneData.remaining_battery < 20 && !droneData.charging_status) {
            const chargingStationsRef = collection(firestore, 'charging_station');
            const chargingStationsSnapshot = await getDocs(chargingStationsRef);

            let nearestStation = null;
            let nearestDistance = Number.MAX_VALUE;

            chargingStationsSnapshot.forEach((stationDoc) => {
              const stationData = stationDoc.data();
              const distance = getDistance(
                { latitude: droneData.location.latitude, longitude: droneData.location.longitude },
                { latitude: stationData.location.latitude, longitude: stationData.location.longitude }
              );

              if (distance < nearestDistance) {
                const availableSlotIndex = stationData.slots.indexOf(false);
                if (availableSlotIndex !== -1) {
                  nearestStation = { id: stationDoc.id, slotIndex: availableSlotIndex };
                  nearestDistance = distance;
                }
              }
            });

            if (nearestStation) {
              const stationDoc = doc(chargingStationsRef, nearestStation.id);
              await updateDoc(stationDoc, {
                [`slots.${nearestStation.slotIndex}`]: true
              });

              await updateDoc(droneDocRef, {
                charging_status: true,
                charging_station: nearestStation.id,
                charging_slot: nearestStation.slotIndex
              });

              console.log(`Drone ${droneDocRef.id} assigned to station ${nearestStation.id} at slot ${nearestStation.slotIndex}`);
            } else {
              console.log('No available charging slots found.');
            }
          }
        }
      } else {
        console.log('Drone not found.');
      }

      const chargingStationsRef = collection(firestore, 'charging_station');
      const chargingStationsSnapshot = await getDocs(chargingStationsRef);
      const stations = chargingStationsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setChargingStations(stations);
    } catch (error) {
      console.error('Error assigning charging station:', error);
    }
  };
//add new charging station logic
  const openModal = () => {
    console.log("nfejo1")
    setShowModal(true);
  };

  const closeModal = () => {
    console.log("nfejo2")
    setShowModal(false);
  };

  const addNewStation = async () => {
    console.log("nfejo")
    try {
      const stationRef = collection(firestore, 'charging_station');
      const newStation = {
        id: newStationData.id,
        location: newStationData.location,
        slots: newStationData.slots,
      };
      await addDoc(stationRef, newStation);
      closeModal();
    } catch (error) {
      console.error('Error adding new charging station:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStationData({ ...newStationData, [name]: value });
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    const location = { ...newStationData.location, [name]: parseFloat(value) };
    setNewStationData({ ...newStationData, location });
  };

  const handleSlotsChange = (e) => {
    const value = parseInt(e.target.value);
    setSlotsInput(value);
    const slots = new Array(value).fill(false);
    setNewStationData({ ...newStationData, slots });
  };

  return (
    // drone details selection
    <div className="simulation-container">
      <div className="centered-heading">
        <h1>Drone Charging Station Simulation</h1>
      </div>
      <div className="form-group">
        <label>
          Drone ID:
          <select value={selectedDroneId} onChange={(e) => setSelectedDroneId(e.target.value)}>
            <option value="" disabled>Select a drone</option>
            {drones.map(drone => (
              <option key={drone.id} value={drone.id}>{drone.id}</option>
            ))}
          </select>
        </label>
        <label>
          Remaining Battery (%):
          <input
            type="number"
            value={remainingBattery}
            onChange={(e) => setRemainingBattery(e.target.value)}
          />
        </label>
        <button className='button-container' onClick={handleAssign}>Assign Charging Station</button>
      </div>
      {/* display charging stations */}
      <div className="centered-heading">
        <h1>Charging Stations</h1><br/>
      </div>
      <button className='button-container' onClick={openModal}>Add New Charging Station</button>
      <div className="charging-stations">
        {chargingStations.map((station) => (
          <div className="station-card" key={station.id}>
            <h3>Station: {station.id}</h3>
            <p>Location: {station.location.latitude}, {station.location.longitude}</p>
            <p>Slots: {station.slots.map((slot, index) => (
              <span key={index}>{slot ? 'Occupied' : 'Available'} </span>
            ))}</p>
          </div>
        ))}
      </div>
{/* popup to enter new charging station details */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <h2>Add New Charging Station</h2>
            <label>
              ID:
              <input type="text" name="id" value={newStationData.id} onChange={handleInputChange} />
            </label>
            <label>
              Latitude:
              <input type="number" step="any" name="latitude" value={newStationData.location.latitude} onChange={handleLocationChange} />
            </label>
            <label>
              Longitude:
              <input type="number" step="any" name="longitude" value={newStationData.location.longitude} onChange={handleLocationChange} />
            </label>
            <label>
              Number of Slots:
              <input type="number" name="slots" value={slotsInput} onChange={handleSlotsChange} />
            </label>
            <button onClick={addNewStation}>Add Station</button>
          </div>
        </div>
      )}
    </div>
  );
};


export default ChargingStationSimulation;
