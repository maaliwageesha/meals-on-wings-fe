import { firestore } from "../firebase";
import { collection, getDocs } from "firebase/firestore";


const getBestDroneId = async (totalWeight, totalDistance) => {
  let drones = [];
//   const droneCollection = await firestore.collection('drone_details').get();
//   droneCollection.forEach(doc => {
//     drones.push({ id: doc.id, ...doc.data() });
//   });


  const droneCollection = await getDocs(collection(firestore, "drone_details"));
   drones = droneCollection.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  console.log("drones",drones)
  let bestDroneId = null;
  let bestScore = Infinity;

  drones.forEach(drone => {
    // Check if the drone is in use
    if (!drone.in_use) return;

    // Check if the drone can carry the total weight
    if (totalWeight > parseFloat(drone.capacity)) return;

    // Calculate the maximum distance the drone can travel with its remaining battery
    const maxDistance = drone.speed * (parseFloat(drone.fly_time.replace('h', '')) * (parseFloat(drone.remaining_battery.replace('%', '')) / 100));

    // Check if the drone can cover the total distance
    if (totalDistance > maxDistance) return;

    // Calculate the score based on the remaining battery and weight capacity utilization
    const score = (totalDistance / maxDistance) * (totalWeight / parseFloat(drone.capacity));

    // Find the drone with the lowest score
    if (score < bestScore) {
      bestScore = score;
      bestDroneId = drone.id;
    }
  });

  return bestDroneId;
};

export default getBestDroneId;
