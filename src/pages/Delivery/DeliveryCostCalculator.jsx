// DeliveryCostCalculator.js

const deliveryCostData = {
    base_cost: 5.0,
    cost_per_km: 2.0,
    distance_brackets: [
      { min_distance_km: 1, max_distance_km: 5, fixed_cost: 10.0 },
      { min_distance_km: 5, max_distance_km: 10, fixed_cost: 15.0 },
      { min_distance_km: 10, max_distance_km: 20, fixed_cost: 20.0 },
      { min_distance_km: 20, max_distance_km: 50, fixed_cost: 30.0 }
    ],
    additional_costs: {
      over_50_km: {
        cost_per_km: 1.5
      }
    }
  };
  
  const calculateDistance = (pickLoc, dropLoc) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (dropLoc.latitude - pickLoc.latitude) * (Math.PI / 180);
    const dLon = (dropLoc.longitude - pickLoc.longitude) * (Math.PI / 180);
    const lat1 = pickLoc.latitude * (Math.PI / 180);
    const lat2 = dropLoc.latitude * (Math.PI / 180);
  
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  };
  
  const calculateDeliveryCost = (pickLoc, dropLoc) => {
    const distance = calculateDistance(pickLoc, dropLoc);
  
    let cost = deliveryCostData.base_cost;
  
    const bracket = deliveryCostData.distance_brackets.find(
      (bracket) => distance >= bracket.min_distance_km && distance < bracket.max_distance_km
    );

    if (bracket) { // cost that falls in the brackets
        cost = bracket.fixed_cost;
    } else if (distance <= 1){ // less than 1km keep base cost
        cost = deliveryCostData.base_cost;
    } else if (distance >= 50) { //greater and 50km
        cost += deliveryCostData.additional_costs.over_50_km.cost_per_km * distance;
    }else {
        cost += deliveryCostData.cost_per_km * distance;
    }
  
    return { distance, cost };
  };
  
  export default calculateDeliveryCost;
  