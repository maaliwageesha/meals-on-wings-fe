// src/pages/Drones/AssignChargingStation.jsx
import { firestore } from './../../firebase';
import { collection, getDoc, getDocs, updateDoc, doc } from 'firebase/firestore';
import { getDistance } from 'geolib';

const assignChargingStation = async (droneIdRef, remainingBattery) => {
    const dronesRef = collection(firestore, 'circulating_drones');
    console.log(dronesRef, droneIdRef);
    const droneDocRef = doc(firestore, droneIdRef.parent.path, droneIdRef.id);
    const droneSnapshot = await getDoc(droneDocRef);
  
    console.log(droneSnapshot);
  
    if (droneSnapshot.exists()) {
      const droneData = droneSnapshot.data();
      // Override the remaining_battery with user input for simulation
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
  
          console.log(`Drone ${droneIdRef.id} assigned to station ${nearestStation.id} at slot ${nearestStation.slotIndex}`);
        } else {
          console.log('No available charging slots found.');
        }
      }
    } else {
      console.log('Drone not found.');
    }
  };
  
  export default assignChargingStation;
  
