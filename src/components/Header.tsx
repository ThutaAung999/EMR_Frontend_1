import React from "react";
import { IoSearch } from "react-icons/io5";

import { IoIosArrowDown } from "react-icons/io";
import defaultLogo from "../assets/images/default.jpg";
import useAuth from "../features/auth/providers/useAuth";

const Header: React.FC = () => {
  const { auth } = useAuth();
console.log("auth :", auth);
  return (
    <section className="  w-full bg-green-500 lg:h-20 h-fit flex lg:flex-row flex-col justify-between items-center p-4  lg:gap-2 gap-4">
      <div>
        <h1 className="text-2xl font-semibold">Overview</h1>
      </div>

      <div className="flex justify-between items-center gap-10">
        <IoSearch className="w-6 h-6 cursor-pointer hover:scale-150 hover:text-yellow-500 transition-all" />
        <div
          id="client-info"
          className="flex justify-center items-center gap-4 "
        >
          
              <img src={ auth.userImage || defaultLogo} 
                  alt="client-image" 
                  className="rounded-full w-12 h-12" />

          <div className="flex flex-col justify-center items-start">
            <div className="flex justify-center items-center -mb-1 gap-2">
              <h1 className="text-lg font-semibold">
                {auth.name || "No Login User"} 
              </h1>
              <IoIosArrowDown />
            </div>
            <p>{auth.role || "-"}</p> 
          </div>
        </div>
      </div>
    </section>
  );
};

export default Header;
