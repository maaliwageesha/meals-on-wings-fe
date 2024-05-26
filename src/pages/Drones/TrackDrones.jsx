import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from './../../firebase';
import { GoogleMap, Marker, InfoWindow, useLoadScript } from '@react-google-maps/api';
import './DroneManagement.css';

const mapContainerStyle = {
  width: '100%',
  height: '100vh',
};

const options = {
  styles: [
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }],
    },
    {
      featureType: 'transit.station',
      stylers: [{ visibility: 'off' }],
    },
  ],
  disableDefaultUI: true,
  zoomControl: true,
};

const center = {
  lat: -37.82034932232931, 
  lng: 145.03597572462573,
};

const TrackDrones = () => {
  const [drones, setDrones] = useState([]);
  const [selectedDrone, setSelectedDrone] = useState(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyCcrZMWt626KxUo-w5l4UR2bHPm16XFceI', // Replace with your actual Google Maps API key
  });

  useEffect(() => {
    const fetchDrones = async () => {
      const querySnapshot = await getDocs(collection(firestore, 'circulating_drones'));
      const droneData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDrones(droneData);
    };

    fetchDrones();
  }, []);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <div className="map-container">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={8}
        center={center}
        options={options}
      >
        {drones.map(drone => (
          <Marker
            key={drone.id}
            position={{
              lat: drone.current_loc.latitude,
              lng: drone.current_loc.longitude,
            }}
            label={drone.id} // Use the drone id as the label
            animation={window.google.maps.Animation.DROP}
            icon={{
              url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
            }}
            onClick={() => {
              setSelectedDrone(drone);
            }}
          />
        ))}

        {selectedDrone && (
          <InfoWindow
            position={{
              lat: selectedDrone.current_loc.latitude,
              lng: selectedDrone.current_loc.longitude,
            }}
            onCloseClick={() => {
              setSelectedDrone(null);
            }}
          >
            <div>
              <h2>Drone ID: {selectedDrone.id}</h2>
              <p><strong>Name:</strong> {selectedDrone.name}</p>
              <p><strong>Latitude:</strong> {selectedDrone.current_loc.latitude}</p>
              <p><strong>Longitude:</strong> {selectedDrone.current_loc.longitude}</p>
              {/* Add other details as necessary */}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default TrackDrones;
