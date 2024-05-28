import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { firestore } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { clearCart } from "../../redux/features/cartSlice";
import { Col, Row } from "react-bootstrap";
import { SectionHead } from "../../components";

export const OrderSuccess = () => {
  let { id } = useParams();
  const dispatch = useDispatch();
  const [locations, setLocations] = useState([]);
  const [chargeLocation, setChargeLocations] = useState();
  const [deliveryDetails, setDeliveryDetails] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [droneDetails, setDroneDetails] = useState(null);

  useEffect(() => {
    dispatch(clearCart());

    const getDeliveryDetails = async (id) => {
      try {
        const deliveryRef = doc(firestore, "deliveries", id);
        const deliveryDoc = await getDoc(deliveryRef);
        if (deliveryDoc.exists()) {
          const deliveryData = deliveryDoc.data();
          setDeliveryDetails(deliveryData);
          console.log("Delivery Data:", deliveryData);

          const pickLoc = {
            lat: deliveryData.pick_loc.latitude,
            lng: deliveryData.pick_loc.longitude,
            label: "Pick-Up Location",
          };
          const dropLoc = {
            lat: deliveryData.drop_loc.latitude,
            lng: deliveryData.drop_loc.longitude,
            label: "Drop-Off Location",
          };
          if(deliveryData.is_charge_required){
            const chargeLoc = {
                lat: deliveryData.charge_station.latitude,
                lng: deliveryData.charge_station.longitude,
                label: "Drop-Off Location",
              };
              setChargeLocations(chargeLoc)
          }

          setLocations([pickLoc, dropLoc]);
      

          const orderUrl = deliveryData.order;
          const orderId = orderUrl.split("/").pop();
          const droneUrl = deliveryData.drone_assigned;
          const droneId = droneUrl.split("/").pop();

          const getOrderDetails = async (orderId) => {
            try {
              const orderRef = doc(firestore, "orders", orderId);
              const orderDoc = await getDoc(orderRef);
              if (orderDoc.exists()) {
                setOrderDetails(orderDoc.data());
              } else {
                console.error("Order details not found.");
              }
            } catch (error) {
              console.error("Error fetching order details:", error);
            }
          };

          const getDroneDetails = async (droneId) => {
            try {
              const droneRef = doc(firestore, "drone_details", droneId);
              const droneDoc = await getDoc(droneRef);
              if (droneDoc.exists()) {
                setDroneDetails(droneDoc.data());
                console.error(droneDoc.data());
              } else {
                console.error("Drone details not found.");
              }
            } catch (error) {
              console.error("Error fetching drone details:", error);
            }
          };

          getOrderDetails(orderId);
          getDroneDetails(droneId);
        } else {
          console.error("Delivery details not found.");
        }
      } catch (error) {
        console.error("Error fetching delivery details:", error);
      }
    };

    getDeliveryDetails(id);
  }, [id, dispatch]);

  useEffect(() => {
    if (locations.length === 2) {
      initMap();
    }
  }, [locations]);

  const initMap = () => {
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 13,
      center: locations[0],
      mapTypeId: "terrain",
    });

    let flightPlanCoordinates = [locations[0]];
    if (chargeLocation) {
      flightPlanCoordinates.push(chargeLocation);
    }
    flightPlanCoordinates.push(locations[1]);

    const flightPath = new google.maps.Polyline({
      path: flightPlanCoordinates,
      geodesic: true,
      strokeColor: "#FF0000",
      strokeOpacity: 1.0,
      strokeWeight: 2,
    });

    flightPath.setMap(map);

    new google.maps.Marker({
      position: locations[0],
      map,
      title: "Pick-Up Location",
      label: "P",
    });

    if(chargeLocation){
        new google.maps.Marker({
            position: chargeLocation,
            map,
            title: "Charge Location",
            label: "c",
          });
    
    }

    new google.maps.Marker({
      position: locations[1],
      map,
      title: "Drop-Off Location",
      label: "D",
    });
  };

  return (
    <div className="min-h-[calc(100vh-80px)]">
      <SectionHead title={"Thank You For Ordering"} showLink={false} />

      <Row className="m-5">
        <Col>
          <div id="map" style={{ height: "500px", width: "100%" }}></div>
        </Col>
        <Col>
          <h1 className="order-header">Order Details</h1>
          <div className="row pb-3">
            <div className="col-6 order-label">Order Status</div>
            <div className="col-6 order-value">{orderDetails && orderDetails.order_status}</div>
          </div>
          <div className="row pb-3">
            <div className="col-6  order-label">Order ID</div>
            <div className="col-6 order-value">{orderDetails && id}</div>
          </div>
          <div className="row pb-3">
            <div className="col-6 order-label">Total Cost</div>
            <div className="col-6 order-value">AUD {orderDetails && orderDetails.total_price}</div>
          </div>
          <div className="row pb-3">
            <div className="col-6 order-label">Delivery Cost</div>
            <div className="col-6 order-value">AUD {deliveryDetails && deliveryDetails.delivery_cost}</div>
          </div>
          <div className="row pb-3">
            <div className="col-6 order-label">Total Distance</div>
            <div className="col-6 order-value">{deliveryDetails && deliveryDetails.distance} KM</div>
          </div>

          <div className="row pb-3">
            <div className="col-6 order-label">Approximate Order Time</div>
            <div className="col-6 order-value">{deliveryDetails && droneDetails && deliveryDetails.distance/droneDetails.speed} hrs</div>
          </div>

{deliveryDetails && deliveryDetails.is_charge_required &&          <div>
            *** The drone will be visiting a charge station before delivery
          </div>}
        </Col>
      </Row>
    </div>
  );
};
