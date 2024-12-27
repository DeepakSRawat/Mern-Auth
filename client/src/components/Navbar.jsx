import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Navbar = () => {
  const navigate = useNavigate();
  const { userData, backendUrl, setUserData, setIsLoggedIn } =
    useContext(AppContext);

  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(`${backendUrl}/auth/send-otp`);
      if (data.success) {
        navigate("/email-verify");
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const logoutUser = async () => {
    try {
      const email = userData.email;
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(`${backendUrl}/auth/logout`, { email });
      console.table(data);
      data.success && setIsLoggedIn(false);
      data.success && setUserData(false);
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <div className="flex justify-between items-center w-full p-4 sm:p-6 sm:px-24 absolute top-0">
      <img src={assets.logo} alt="" className="w-28 sm:w-32" />
      {userData ? (
        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-black text-white relative group">
          {userData.name[0].toUpperCase()}
          <div className="hidden absolute top-0 right-0 z-10 text-black rounded pt-10 group-hover:block">
            <ul className="list-none m-0 p-2 bg-gray-100 text-sm">
              {!userData.userVerified && (
                <li
                  onClick={sendVerificationOtp}
                  className="py-1 px-2 hover:bg-gray-200 cursor-pointer"
                >
                  Verify Email
                </li>
              )}
              <li
                onClick={logoutUser}
                className="py-1 px-2 hover:bg-gray-200 cursor-pointer pr-10"
              >
                Logout
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100"
        >
          Login <img src={assets.arrow_icon} />
        </button>
      )}
    </div>
  );
};

export default Navbar;