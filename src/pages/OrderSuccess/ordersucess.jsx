import { Col, Row } from "react-bootstrap";
import { SectionHead } from "../../components";
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import { Polyline } from '@react-google-maps/api';
import { firestore } from "../../firebase";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { clearCart } from "../../redux/features/cartSlice";

export const OrderSuccess = () => {
    let { id } = useParams();
    const dispatch = useDispatch()
    const [locations, setLocations] = useState([]);
    const [deliveryDetails, setDeliveryDetails] = useState(null);
    const [orderDetails, setOrderDetails] = useState(null);
    const [droneDetails, setDroneDetails] = useState(null);

    useEffect(() => {
        dispatch(clearCart())
        const getDeliveryDetails = async (id) => {
            try {
                const deliveryRef = doc(firestore, "deliveries", id);
                const deliveryDoc = await getDoc(deliveryRef);
                if (deliveryDoc.exists()) {
                    const deliveryData = deliveryDoc.data();
                    setDeliveryDetails(deliveryData);
                    console.log(deliveryData);
                    setLocations([
                        { lat: deliveryData.pick_loc.latitude, lng: deliveryData.pick_loc.longitude, label: 'Pick-Up Location' },
                        { lat: deliveryData.drop_loc.latitude, lng: deliveryData.drop_loc.longitude, label: 'Drop-Off Location' }
                    ]);

                    // Extract the order ID from delivery details
                    const orderUrl = deliveryData.order;
                    const orderId = orderUrl.split("/").pop(); // Assuming the order ID is at the end of the URL

// Extract the order ID from delivery details
const droneUrl = deliveryData.drone_assigned;
const droneId = droneUrl.split("/").pop(); // Assuming the order ID is at the end of the URL
                   
                    // Fetch order details
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
                            const dronerDoc = await getDoc(droneRef);
                            console.log("visited",dronerDoc.data())
                            if (dronerDoc.exists()) {
                                setDroneDetails(dronerDoc.data());
                            } else {
                                console.error("drone details not found.");
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

    }, [id]);

    return (
        <div className="min-h-[calc(100vh-80px)]">
            <SectionHead title={"Thank You For Ordering"} showLink={false} />

            <Row>
                <Col >
                    {locations.length > 0 && (
                        <APIProvider apiKey={'AIzaSyCcrZMWt626KxUo-w5l4UR2bHPm16XFceI'}>
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
                            </Map>
                        </APIProvider>
                    )}
                </Col>
                <Col>
                <h1>order details</h1>

<div className="row pb-3">
                <div className="col-6">Order Status</div>
                <div className="col-6">{orderDetails && orderDetails.order_status}</div>
                </div>

                <div className="row pb-3">
                <div className="col-6">Order ID</div>
                <div className="col-6">{orderDetails && id}</div>
                </div>


                <div className="row pb-3">
                <div className="col-6">Total Cost</div>
                <div className="col-6">AUD {orderDetails && orderDetails.total_price}</div>
                </div>

                <div className="row pb-3">
                <div className="col-6">Delivery Cost</div>
                <div className="col-6">AUD {deliveryDetails && deliveryDetails.delivery_cost}</div>
                </div>

                <div className="row pb-3">
                <div className="col-6">Total Distance</div>
                <div className="col-6"> {deliveryDetails && deliveryDetails.distance} KM</div>
                </div>
                
                </Col>
            </Row>
        </div>
    );
};
