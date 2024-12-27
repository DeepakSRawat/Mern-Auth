import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";

function Header() {
  const { userData } = useContext(AppContext);
  // console.log("userData:", userData);
  return (
    <div className="flex flex-col items-center justify-center text-center p-6">
      <img src={assets.header_img} className="w-36 h-36 rounded-full mb-6" />
      <h1 className=" flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2">
        Hey {userData ? userData.name : "Developer"}!
        <img className="w-8 aspect-square" src={assets.hand_wave} />
      </h1>
      <h2 className="text-3xl sm:text-5xl font-semibold mb-4">
        Welcome to our app
      </h2>
      <p className="mb-8 max-w-md">
        Let's start with a quick product tour and we will have you up and
        running in no time!
      </p>
      <button className="border border-gray-500 px-8 py-2.5 rounded-full p-3 sm:text-3px hover:bg-gray-200 transition-all">
        Get Started
      </button>
    </div>
  );
}

export default Header;
