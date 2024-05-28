import { useEffect, useState } from "react";
import {
  SectionHead,
  MenuItem,
  GridContainer,
  MenuFilter,
  Loader,
} from "../../components";
import { getAllMenuItems } from "../../redux/features/menuItemsSlice";
import { useDispatch, useSelector } from "react-redux";
import Empty from "../Empty";
import { firestore } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";

function MenuList() {
  const dispatch = useDispatch();
  const [category, setCategory] = useState("all");
  const { data, loading } = useSelector((state) => state.menu);
  const [restaurants, setRestaurants] = useState([]);
  const dataToShow =
    category === "all" ? data : data.filter((el) => el.category === category);

  useEffect(() => {
    dispatch(getAllMenuItems());


    

    // Fetch restaurant details from Firebase
    const fetchRestaurants = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, "restaurant_details"));
        const restaurantList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRestaurants(restaurantList);
      } catch (error) {
        console.error("Error fetching restaurant details: ", error);
      }
    };

    fetchRestaurants();

  }, [dispatch, category]);
  const handleRestaurantChange = (event) => {
    const selectedRest = restaurants.find(
      (rest) => rest.id === event.target.value
    );
    setSelectedRestaurant(selectedRest);
    localStorage.setItem("location", JSON.stringify(selectedRest.rest_loc));
  };
  if (loading) return <Loader />;

  if (data?.length <= 0) return <Empty message={"No menu Data Available"} />;

  return (
    <div className="min-h-[calc(100vh-80px)]">
      <div className="d-flex justify-content-between">
      <SectionHead title={"Our Menu"} showLink={false} />
      <div>
      <select className="form-control" onChange={handleRestaurantChange}>
          <option value="">Select Restaurant</option>
          {restaurants.map((restaurant) => (
            <option key={restaurant.id} value={restaurant.id}>
              {restaurant.rest_name}
            </option>
          ))}
        </select>
        </div>
        </div>
      <div className="flex flex-col-reverse items-start gap-[20px] md:flex-row md:gap-[10px]">
        <div className="w-full">
          <GridContainer>
            {dataToShow?.map((item) => {
              return <MenuItem item={item} key={item.id} />;
            })}
          </GridContainer>
        </div>

        <MenuFilter category={category} setCategory={setCategory} />
      </div>
    </div>
  );
}

export default MenuList;
