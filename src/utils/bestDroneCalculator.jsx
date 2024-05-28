import { firestore } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

// Haversine formula to calculate the distance between two points
const haversineDistance = (coords1, coords2) => {
  const toRad = (x) => x * Math.PI / 180;
  const R = 6371; // Earth radius in kilometers

  const dLat = toRad(coords2.lat - coords1.lat);
  const dLon = toRad(coords2.lng - coords1.lng);
  const lat1 = toRad(coords1.lat);
  const lat2 = toRad(coords2.lat);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Function to find the closest point from a list of points
const findClosestPoint = (target, points) => {
  let minDistance = Infinity;
  let closestPoint = null;

  points.forEach((point) => {
    const distance = haversineDistance(target, point);
    if (distance < minDistance) {
      minDistance = distance;
      closestPoint = point;
    }
  });

  return closestPoint;
};

// Main function to allocate a drone
export const allocateDrone = async (itemWeight, distance, startPoint, endPoint) => {
  // Fetch drone details from Firestore
  const droneSnapshot = await getDocs(collection(firestore, "drone_details"));
  const drones = droneSnapshot.docs.map(doc => doc.data());

  // Filter drones based on capacity and in-use status
  const suitableDrones = drones.filter(drone => drone.capacity >= itemWeight && drone.in_use);

  if (suitableDrones.length === 0) {
    throw new Error("No suitable drones available.");
  }

  // Fetch charging locations from Firestore
  const chargingSnapshot = await getDocs(collection(firestore, "charging_locations"));
  const chargingLocations = chargingSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  // Function to calculate flight time required for the distance
  const calculateFlightTime = (distance, speed) => distance / speed;

  let selectedDrone = null;
  let chargeStation = null;

  for (const drone of suitableDrones) {
    const droneSpeed = drone.speed; // speed in km/h
    const requiredFlightTime = calculateFlightTime(distance, droneSpeed); // time in hours
    console.log("flight time",requiredFlightTime)
    const availableFlightTime = (parseFloat(drone.remaining_battery) / 100) * parseFloat(drone.fly_time); // time in hours
    console.log("av flight time",availableFlightTime)
    if (availableFlightTime >= requiredFlightTime) {
      // Drone can complete the delivery without recharging
      selectedDrone = drone;
      break;
    } else {
      console.log("required charging",chargingLocations)
      // Drone requires recharging
      const closestChargingPoint = findClosestPoint(startPoint, chargingLocations.map(loc => loc.location));
      console.log("closest charging",closestChargingPoint)
      if (closestChargingPoint) {
        selectedDrone = drone;
        chargeStation = closestChargingPoint;
        break;
      }
    }
  }

  if (!selectedDrone) {
    throw new Error("No suitable drones available after considering battery constraints.");
  }

  return {
    droneId: selectedDrone.id,
    chargeStationId: chargeStation ? chargeStation : null
  };
};

// // Example usage:
// const itemWeight = 100; // weight of the item in grams
// const distance = 1500; // distance in km
// const startPoint = { lat: 6.796388, lng: 79.887962 };
// const endPoint = { lat: 6.8142528672662355, lng: 79.87724474030023 };

// allocateDrone(itemWeight, distance, startPoint, endPoint)
//   .then(result => {
//     console.log("Allocated Drone:", result);
//   })
//   .catch(error => {
//     console.error("Error:", error);
//   });
