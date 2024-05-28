import React, { useState, useEffect } from 'react';
import { firestore } from './../../firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import './Delivery.css';

export const Deliveries = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [drones, setDrones] = useState([]);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [selectedDrone, setSelectedDrone] = useState(null);

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const deliveriesCollection = collection(firestore, 'deliveries');
        const deliveriesSnapshot = await getDocs(deliveriesCollection);

        const deliveryData = deliveriesSnapshot.docs
          .map(deliveryDoc => ({
            id: deliveryDoc.id,
            ...deliveryDoc.data()
          }))
          .filter(delivery => delivery.delivery_status !== 'complete'); // Filtering out 'complete' deliveries
          
        setDeliveries(deliveryData);
      } catch (error) {
        console.error("Error fetching deliveries: ", error);
      }
    };

    fetchDeliveries();
  }, []);

  useEffect(() => {
    const fetchDrones = async () => {
      try {
        const dronesCollection = collection(firestore, 'circulating_drones');
        const dronesSnapshot = await getDocs(dronesCollection);

        const droneData = dronesSnapshot.docs.map(droneDoc => ({
          id: droneDoc.id,
          ...droneDoc.data()
        }));
        setDrones(droneData);
      } catch (error) {
        console.error("Error fetching drones: ", error);
      }
    };

    if (selectedDelivery) {
      fetchDrones();
    }
  }, [selectedDelivery]);

  const handleAssignDrone = (delivery) => {
    setSelectedDelivery(delivery);
    setSelectedDrone(null); // Reset selected drone when a new delivery is selected
    console.log('Assign Drone button clicked, card should open', delivery);
  };

  const assignDroneToDelivery = async () => {
    try {
      if (selectedDelivery && selectedDrone) {
        const deliveryDocRef = doc(firestore, 'deliveries', selectedDelivery.id);
        await updateDoc(deliveryDocRef, {
          drone_assigned: selectedDrone.id
        });

        const droneDocRef = doc(firestore, 'circulating_drones', selectedDrone.id);
        await updateDoc(droneDocRef, {
          assigned: true
        });

        const droneAssignDocRef = doc(firestore, 'circulating_drones', selectedDrone.id);
        await updateDoc(droneAssignDocRef, {
          status: true
        });

        setDeliveries(prevDeliveries =>
          prevDeliveries.map(delivery =>
            delivery.id === selectedDelivery.id ? { ...delivery, drone_assigned: selectedDrone.id } : delivery
          )
        );

        setDrones(prevDrones =>
          prevDrones.map(drone =>
            drone.id === selectedDrone.id ? { ...drone, assigned: true } : drone
          )
        );

        setSelectedDelivery(null);
        setSelectedDrone(null);
      }
    } catch (error) {
      console.error("Error assigning drone: ", error);
    }
  };

  return (
    <div className="container">
      <h1>Deliveries</h1>
      <table className="menu-table">
        <thead>
          <tr>
            <th>Delivery Cost</th>
            <th>Delivery Date Time</th>
            <th>Delivery Status</th>
            <th>Drone Assigned</th>
            <th>Is Item Handed</th>
            <th>Is Item Picked</th>
            <th>Order</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {deliveries.map((delivery, index) => (
            <tr key={index}>
              <td>{delivery.delivery_cost}</td>
              <td>{(delivery.delivery_date_time.seconds * 1000).toLocaleString()}</td>
              <td>{delivery.delivery_status}</td>
              <td>{typeof delivery.drone_assigned === 'string' ? delivery.drone_assigned : (delivery.drone_assigned && delivery.drone_assigned.id) || 'N/A'}</td>
              <td>{delivery.is_item_handed ? 'Yes' : 'No'}</td>
              <td>{delivery.is_item_picked ? 'Yes' : 'No'}</td>
              <td>{delivery.order || 'N/A'}</td>
              <td>
                <button onClick={() => handleAssignDrone(delivery)}>Assign Drone</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedDelivery && (
        <div className="edit-card">
          <div className="card-content">
            <h2>Select a Drone</h2>
            <ul>
              {drones.map(drone => (
                <li
                  key={drone.id}
                  onClick={() => setSelectedDrone(drone)}
                  style={{ cursor: 'pointer', backgroundColor: selectedDrone && selectedDrone.id === drone.id ? '#e0e0e0' : 'white' }}
                >
                  <div>Name: {drone.name}</div>
                  <div>Assigned: {drone.assigned ? 'Yes' : 'No'}</div>
                  <div>Battery: {drone.remaining_battery}</div>
                  <div>Serial Number: {drone.serialNumber}</div>
                </li>
              ))}
            </ul>
            <button onClick={assignDroneToDelivery} disabled={!selectedDrone}>Assign</button>
            <button onClick={() => setSelectedDelivery(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};
