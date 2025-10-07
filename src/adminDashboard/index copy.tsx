import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Users, Car, Store, Earth } from "lucide-react"; // Import icons from lucide-react
import Sidebar from "./Sidebar";

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("users");

  return (
    <div className="md:flex min-h-screen relative">
      {/* Sidebar */}
      <Sidebar className="md:fixed md:w-64 bg-gray-800 text-white py-8 h-full" />
      
      {/* Main Content */}
      <div className="md:flex-1 md:ms-64 p-6"> {/* Add margin-left to account for the sidebar width */}
        <div className="flex justify-between">
            {/* <h1 className="text-2xl font-bold mb-4">لوحة التحكم</h1> */}
        </div>
        
        <Outlet /> {/* This will render the selected content based on the route */}
      </div>
    </div>
  );
};

export default AdminDashboard;
