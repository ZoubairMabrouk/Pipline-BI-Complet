import React from "react";
import { Link } from "react-router-dom";
import { FaTachometerAlt, FaUsers, FaShoppingCart, FaReceipt, FaBook, FaList, FaSignOutAlt, FaSalesforce, FaDashcube, FaRegTimesCircle } from "react-icons/fa";


const Sidebar = () => {
  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem("token");
      window.location.href = "/";
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-64 h-screen text-white-500 bg-blue-900 p-4 flex flex-col fixed">
      
      <ul className="space-y-2 flex-grow text-white-800">
        <div className="text-white">
      <SidebarItem to="/" icon={<FaDashcube />} label="Dashbord" />
      </div><SidebarItem to="/employee" icon={<FaUsers />} label="Employees" />
        <SidebarItem to="/sale" icon={<FaSalesforce />} label="Territory Sales" />
        
        <SidebarItem to="/forecast" icon={<FaRegTimesCircle />} label="Prediction" />
        </ul>
        
    </div>
  );
};

const SidebarItem = ({ to, icon, label }) => (
  <li>
    <Link
      to={to}
      className="flex items-center space-x-2 p-2 rounded hover:bg-blue-700 transition text-white-200"
    >
      {icon}
      <span>{label}</span>
    </Link>
  </li>
);

export default Sidebar;
