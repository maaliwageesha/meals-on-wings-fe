import React, { useEffect, useState, useRef } from 'react';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import { Polyline } from '@react-google-maps/api';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../../firebase';
import './Delivery.css';
import calculateDeliveryCost from './DeliveryCostCalculator';

// interface Delivery {
//   id: string;
//   delivery_cost: number;
//   delivery_date_time: string;
//   delivery_status: string;
//   drone_assigned: string;
//   drop_loc: { latitude: number; longitude: number };
//   is_item_handed: boolean;
//   is_item_picked: boolean;
//   order: string;
//   pick_loc: { latitude: number; longitude: number };
// }

export const DeliveryMap = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [locations, setLocations] = useState([]);
  const [distance, setDistance] = useState(null);
  const [deliveryCost, setDeliveryCost] = useState(null);
  const originRef = useRef(null);
  const destiantionRef = useRef(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);

  useEffect(() => {
    const fetchDeliveries = async () => {
      const deliveriesCollection = collection(firestore, 'deliveries');
      const deliverySnapshot = await getDocs(deliveriesCollection);
      const deliveryList = deliverySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setDeliveries(deliveryList);
    };

    fetchDeliveries();
  }, []);

  useEffect(() => {
    if (selectedDelivery) {
      const { pick_loc, drop_loc } = selectedDelivery;
      setLocations([
        { lat: pick_loc.latitude, lng: pick_loc.longitude, label: 'Pick-Up Location' },
        { lat: drop_loc.latitude, lng: drop_loc.longitude, label: 'Drop-Off Location' }
      ]);
      
      const calculateAndSetDeliveryCost = async () => {
        const { distance, cost } = await calculateDeliveryCost(pick_loc, drop_loc);
        setDistance(distance);
        setDeliveryCost(cost);
        console.log(distance, cost);
      };
      
      calculateAndSetDeliveryCost();
    }
  }, [selectedDelivery]);

  const handleDeliveryChange = (event) => {
    const selectedId = event.target.value;
    const delivery = deliveries.find(delivery => delivery.id === selectedId) || null;
    setSelectedDelivery(delivery);
  };

  return (
    <div className="delivery-map-container">
      <h1>Current Delivery</h1>
      <select className="delivery-select" onChange={handleDeliveryChange} defaultValue="">
        <option value="" disabled>Select a delivery</option>
        {deliveries.map(delivery => (
          <option key={delivery.id} value={delivery.id}>
            {delivery.id}
          </option>
        ))}
      </select>

      {selectedDelivery && (
        <div className="delivery-info">
          <p><strong>Delivery Cost:</strong> ${deliveryCost !== null ? deliveryCost.toFixed(2) : 'Calculating...'}</p>
          <p><strong>Delivery Date and Time:</strong> {new Date(selectedDelivery.delivery_date_time).toLocaleString()}</p>
          <p><strong>Delivery Status:</strong> {selectedDelivery.delivery_status}</p>
          <p><strong>Item Picked:</strong> {selectedDelivery.is_item_picked ? 'Yes' : 'No'}</p>
          <p><strong>Item Handed:</strong> {selectedDelivery.is_item_handed ? 'Yes' : 'No'}</p>
          {distance !== null && <p><strong>Distance:</strong> {distance.toFixed(2)} km</p>}
        </div>
      )}

      {locations.length > 0 && (
        <APIProvider apiKey={'AIzaSyCcrZMWt626KxUo-w5l4UR2bHPm16XFceI'}>
          {deliveries.length === 0 ? (
            <p>Loading deliveries...</p>
          ) : (
            
            <Map
              defaultZoom={13}
              defaultCenter={locations[0]}
              mapTypeControl={true}
              streetViewControl={false}
              fullscreenControl={true}
              onCameraChanged={(ev) => console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom)}
            >
              {locations.map((location, index) => (
                <Marker
                  key={index}
                  position={{ lat: location.lat, lng: location.lng }}
                  label={location.label}
                />
              ))}
              {locations.length === 2 && (
                <Polyline
                  path={locations.map(loc => ({ lat: loc.lat, lng: loc.lng }))}
                  options={{ geodesic: true, strokeColor: '#FF0000', strokeWeight: 4, strokeOpacity: 1 }}
                />
              )}
              {directionsResponse && (
                <Polyline
                  path={directionsResponse.routes[0].overview_path.map((p) => ({
                    lat: p.lat(),
                    lng: p.lng()
                  }))}
                  options={{
                    geodesic: true,
                    strokeColor: "#00FF00",
                    strokeOpacity: 1,
                    strokeWeight: 5
                  }}
                />
              )}
            </Map>
          )}
        </APIProvider>
      )}
    </div>
  );
};


