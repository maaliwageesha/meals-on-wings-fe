import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearCart,
  deleteItem,
  getCart,
  getTotalCartPrise,
  getTotalCartWeight,
} from "../../redux/features/cartSlice";
import { formatCurrency } from "../../utils/helpers";
import { fetchAddress } from "../../redux/features/addressSlice";
import { getUser } from "../../redux/features/authSlice";
import { useNavigate } from "react-router-dom";

import NoUser from "./NoUser";
import Button from "../Button";
import SectionHead from "../SectionHead";
import UpdateItemQuantity from "../cart/UpdateItemQuantity";
import toast from "react-hot-toast";
import Empty from "../Empty";

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import StripeContainer from "../payments/StripeContainer";
import calculateDeliveryCost from "../../pages/Delivery/DeliveryCostCalculator";
import getBestDroneId from "../../utils/bestDroneCalculator";
import firebase from "firebase/compat/app";
import { addDoc, collection } from "firebase/firestore";
import { app, firestore } from "../../firebase";

const initialState = {
  name: "",
  phone: "",
  address: "",
  error: "",
};

function OrdersList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(getUser);
  const cart = useSelector(getCart);
  const totalPrice = useSelector(getTotalCartPrise);
  const totalWeight = useSelector(getTotalCartWeight);

  const [values, setValues] = useState(initialState);
  const { name, phone, address, error } = values;

  const [fetchedAddress, setFetchedAddress] = useState("");
  const [fetchedPosition, setFetchedPosition] = useState();

  


  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleGetAddress = async (e) => {
    e.preventDefault();
    try {
      const action = await dispatch(fetchAddress());
      if (fetchAddress.fulfilled.match(action)) {
        const { address, position } = action.payload;
        console.log(position)
        setFetchedPosition(position)
        setFetchedAddress(address); // Update the local state with the fetched address
      }
    } catch (error) {
      setValues({ ...values, error: error });
    }
  };

  // On submit the form
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !phone || !address) {
      setValues({ ...values, error: "Please Fill Out All fields." });
      return;
    }
    dispatch(clearCart());
    setValues(initialState);
    toast.success("Your Order On The Way.");
    navigate("/");
  };


  const addOrderToFirestore = async () => {

    if(!fetchedAddress){
      toast.error("Address field is mandatory")
      return;
    }
    const pick_location={latitude:-37.8115860744369,longitude:144.9720203541015}
    const {distance,cost} = calculateDeliveryCost(pick_location,fetchedPosition)

    const bestDrone = await getBestDroneId(totalWeight,distance)
    const valuesArray = cart.map(item => ({
      item: "/items/"+item.id,
      quantity:item.item_quantity,
    }));
    

    console.log("add detaisssss")
    try {
      const orderDocRef = await addDoc(collection(firestore, "orders"), {
        customer: "/Customer_details/1QX7Os6FkU6TFVzrhcjl",
        item_array: valuesArray,
        order_date:  new Date(),
        order_status: "pending",
        restaurant: "/restaurant_details/5",
        total_price: formatCurrency(totalPrice)
      });
      console.log("Order document written with ID: ", orderDocRef.id);
 
      // Add delivery document using the order ID
      const deliveryDocRef = await addDoc(collection(firestore, "deliveries"), {
        delivery_cost: cost,
        delivery_date_time:  new Date(),
        delivery_status: "pending",
        drone_assigned: bestDrone?"/drone_details/"+bestDrone:"/drone_details/URRAy31nbKuINNXqWIMOsF",
        is_item_handed: false,
        is_item_picked: false,
        order: `/order/${orderDocRef.id}`,
        drop_loc:fetchedPosition,
        pick_loc:pick_location,
        distance:distance,
        // can we pass the rest_loc and delivery address here?
      });

      console.log("Delivery document written with ID: ", deliveryDocRef.id);
      return deliveryDocRef.id
    } catch (e) {
      console.error("Error adding documents: ", e);
    }

  
  };


  if (!user) return <NoUser />;

  if (!cart.length) return <Empty message="The is No Orders." />;

  return (
    <div className="min-h-[calc(100vh-80px)]">
      <SectionHead title={"Order Now"} showLink={false} />
      <div className="flex flex-col-reverse items-start gap-[20px] md:flex-row">
        <div className="w-full md:w-[50%]">
          <div className="flex w-full flex-col items-center gap-[20px] p-[20px]">
            <input
              className="input"
              type="text"
              name="name"
              placeholder={"Your Name"}
              value={name}
              onChange={handleChange}
            />

            <input
              className="input"
              type="number"
              name="phone"
              placeholder={"Phone Number"}
              value={phone}
              onChange={handleChange}
            />

            <div className="flex w-full items-center gap-[10px] rounded-full border border-lightGray bg-gray p-[10px]">
              <input
                className="w-full bg-transparent outline-none placeholder:text-sm"
                type="text"
                name="address"
                placeholder={"Address"}
                value={fetchedAddress || address}
                onChange={handleChange}
              />
              <button
                onClick={handleGetAddress}
                className="h-full w-[150px] rounded-xl bg-yellow py-[2px]  text-xs hover:bg-darkYellow hover:text-white"
              >
                Get Position
              </button>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}
            {/* <Button onClick={handleSubmit}>
              Order Now For{" "}
              <span className="underline"> {formatCurrency(totalPrice)}</span>
            </Button> */}
            <StripeContainer createOrder={addOrderToFirestore} price={formatCurrency(totalPrice)}/>
          </div>
        </div>

        <div className="w-full md:w-[50%]">
          {cart?.map((item) => {
            return (
              <div
                key={item.id}
                className="flex items-center justify-between border-b border-darkGray  py-[10px]"
              >
                <p className="text-lightGray">
                  <span className="text-sm">x{item.item_quantity}</span> {item.item_name}
                </p>
                <div className="flex items-center gap-[20px]">
                  <span className="text-sm">{formatCurrency(item.item_price)}</span>
                  <UpdateItemQuantity id={item.id} currentQuantity={item.item_quantity} />
                  <Button onClick={() => dispatch(deleteItem(item.id))}>
                    Delete
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default OrdersList;
