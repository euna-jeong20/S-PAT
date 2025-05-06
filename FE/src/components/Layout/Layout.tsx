import React from "react";
import Sidebar from "../common/SideBar";
import { Outlet } from "react-router-dom";

const Layout: React.FC = () => {
  return (
    <>
      <div className="h-screen w-full bg-background flex justify-between">
        <Sidebar />
        <div className="w-4/5 rounded-xl bg-gradient-to-b from-white to-blue-100 shadow-lg flex flex-col justify-start m-2">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Layout;
