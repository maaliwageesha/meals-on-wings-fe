import { Route, Routes } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Header, AuthForm, Footer, ScrollToTop } from "./components";
import { Home, Menu, About, Blog, NotFound, Orders } from "./pages";
import { Deliveries } from "./pages/Delivery/deliveryhome";
import { DeliveryMap } from "./pages/Delivery/deliveryMap.jsx";

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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AnimatePresence>
  );
}

export default App;
