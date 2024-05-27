import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore"; // Import Firestore functions
import { auth, firestore } from "../firebase"; // Make sure to initialize Firestore in your firebase.js file
import { setUser } from "../redux/features/authSlice";
import { loginFormData } from "../data/staticData";
import { useNavigate } from "react-router-dom";

import Container from "./Container";
import Button from "./Button";
import toast from "react-hot-toast";

const initialState = {
  email: "",
  password: "",
  userType: "customer", // Default user type
  error: "",
};

function AuthForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [values, setValues] = useState(initialState);
  const { email, password, userType, error } = values;

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleUserTypeChange = (e) => {
    setValues({ ...values, userType: e.target.value });
  };

  const createAccount = async () => {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      const { uid, email: userEmail } = user;
      const serializedUser = { uid, email: userEmail, userType };
      await setDoc(doc(firestore, "users", uid), { userType }); // Save user type to Firestore
      dispatch(setUser(serializedUser));
      setValues(initialState);
      toast.success("Account successfully created.");
      navigate("/");
    } catch (error) {
      setValues({ ...values, error: error.message });
    }
  };

  const logIn = async () => {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      const { uid, email: userEmail } = user;
      const userDoc = await getDoc(doc(firestore, "users", uid)); // Retrieve user type from Firestore
      const userType = userDoc.exists() ? userDoc.data().userType : "customer";
      const serializedUser = { uid, email: userEmail, userType };
      dispatch(setUser(serializedUser));
      localStorage.setItem("userType", userType); // Save user type to local storage
      setValues(initialState);
      toast.success("Logged in successfully.");
      if(userType=="customer"){
        navigate("/");
      }else if(userType=="regulator"){
        navigate("/drone");
      }else{
        navigate("/res-dashboard");
      }
     
    } catch (error) {
      setValues({ ...values, error: error.message });
    }
  };

  const handleAuthClick = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setValues({ ...values, error: "Please input an email and password." });
      return;
    }
    if (isLogin) {
      logIn();
    } else {
      createAccount();
    }
  };

  return (
    <Container>
      <div className="flex h-[calc(100vh-60px)] items-center justify-center">
        <form className="flex w-full flex-col items-center justify-center gap-[10px] rounded-xl bg-white p-[20px] md:w-[400px]">
          <h3 className="mb-[10px] text-xl font-bold">
            {isLogin ? "Log in" : "Create an account"}
          </h3>
          {loginFormData.map((el) => {
            return (
              <div
                key={el.id}
                className="mb-[10px] flex w-full flex-col items-start gap-[5px]"
              >
                <label className="font-bold" htmlFor={el.name}>
                  {el.title}:
                </label>
                <input
                  className="input"
                  id={el.name}
                  type={el?.type}
                  placeholder={el?.title}
                  name={el?.name}
                  value={values[el?.name]}
                  onChange={handleChange}
                />
              </div>
            );
          })}

          {!isLogin && (
            <div className="mb-[10px] flex w-full flex-col items-start gap-[5px]">
              <label className="font-bold" htmlFor="userType">User Type:</label>
              <select
                className="input"
                id="userType"
                name="userType"
                value={userType}
                onChange={handleUserTypeChange}
              >
                <option value="regulator">Regulator</option>
                <option value="restaurant_admin">Restaurant Admin</option>
                <option value="customer">Customer</option>
              </select>
            </div>
          )}

          <Button onClick={handleAuthClick}>
            {isLogin ? "Log in" : "Create an account"}
          </Button>
          {error && <p className="text-sm font-bold text-red-400">{error}</p>}
          <p
            className="mt-[10px] cursor-pointer text-sm font-bold text-yellow"
            onClick={() => setIsLogin((p) => !p)}
          >
            {isLogin ? "Create new account!" : "Already have an account!"}
          </p>
        </form>
      </div>
    </Container>
  );
}

export default AuthForm;
