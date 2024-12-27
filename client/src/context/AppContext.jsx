import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const AppContext = createContext();

axios.defaults.withCredentials = true;

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(false);

  useEffect(() => {
    getAuthState();
  }, []);

  const getAuthState = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/auth/is-auth`);
      if (data.success) {
        setIsLoggedIn(true);
        console.log("user verified");
        getUserData();
      } else {
        console.warn("user not verified");
      }
    } catch (error) {
      toast.error(error.message + " at getAuthState");
    }
  };

  const getUserData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/user/data`);
      data.success ? setUserData(data.userData) : toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const value = {
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    getAuthState,
    getUserData,
  };
  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
