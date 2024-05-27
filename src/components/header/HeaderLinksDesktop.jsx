import { motion } from "framer-motion";
import { headerLinks } from "../../data/staticData";
import { NavLink } from "react-router-dom";
import { getUser, getUserType } from "../../redux/features/authSlice";
import { useDispatch, useSelector } from "react-redux";

function HeaderLinksDesktop() {
  const userType = useSelector(getUserType);
  return (
    <motion.ul
      initial={{ opacity: 0, x: 200, y: 200 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, x: 200, y: 200 }}
      className={"flex items-center justify-between gap-[50px]"}
    >
      {headerLinks.map((l) => {
        if (l.auth === "no" && (userType=="customer" && userType !="regulator" && userType != "restaurant_admin")) {
          return (
            <li key={l.id} className="text-base font-bold hover:text-yellow">
              <NavLink to={l.to}>{l.title}</NavLink>
            </li>
          );
        } else if (userType && l.auth === userType && userType !== "customer" && l.auth!="no") {
          return (
            <li key={l.id} className="text-base font-bold hover:text-yellow">
              <NavLink to={l.to}>{l.title}</NavLink>
            </li>
          );
        }else if(!userType && l.auth=="no"){
          return (
            <li key={l.id} className="text-base font-bold hover:text-yellow">
              <NavLink to={l.to}>{l.title}</NavLink>
            </li>
          );
        }
        return null;
      })}

    </motion.ul>
  );
}

export default HeaderLinksDesktop;
