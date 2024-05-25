import { Route, Routes } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Header, AuthForm, Footer, ScrollToTop } from "./components";
import { Home, Menu, About, Blog, NotFound, Orders } from "./pages";
import { Deliveries } from "./pages/Delivery/deliveryhome";
import { DeliveryMap } from "./pages/Delivery/deliveryMap.jsx";
import { MenuManagement } from "./pages/restaurant/MenuManagement.jsx";
import { AddMenuItem } from "./pages/restaurant/AddMenuItem.jsx";
import { EditMenuItem } from "./pages/restaurant/EditMenuItem.jsx";
import { OrderHistory } from "./pages/restaurant/OrderHistory.jsx"; 
import { RestrauntOngoingOrders } from "./pages/restaurant/RestrauntOngoingOrders.jsx";
import { DroneManagement} from "./pages/Drones/DroneManagement.jsx"
function App() {
  return (
    <AnimatePresence>
      <div className="flex flex-col bg-gray text-textColor">
        <ScrollToTop />
        <Header />
        <main className="mt-[60px]">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<AuthForm />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/delv" element={<Deliveries/>}/>
          <Route path="/maps" element={<DeliveryMap/>}/>
          <Route path="/menu-management" element={<MenuManagement />} />
          <Route path="/add-menu-item" element={<AddMenuItem />} />
          <Route path="/edit-menu-item/:id" element={<EditMenuItem />} />
          <Route path="/order-history" element={<OrderHistory />} />
          <Route path="/ongoing-orders" element={<RestrauntOngoingOrders />} />
          <Route path="/drone" element={<DroneManagement />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AnimatePresence>
  );
}

export default App;
