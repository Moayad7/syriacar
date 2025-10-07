import React from "react";
import { Link, NavLink } from "react-router-dom"; // استيراد NavLink
import { Users, Car, Store, Tag, Wrench, Earth } from "lucide-react"; // استيراد الأيقونات
import logo from '../assets/22-03-DwLk1Z1i.png';

const Sidebar: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={className}>
      <div className="grid place-items-center py-4">
        <Link 
          to="/" 
          className="flex items-center gap-2"
        >
          <img className='px-1' width="45px" src={logo} alt="" />
        </Link>
      </div>
      <div className="flex items-center p-4">
        <Earth />
        <Link
          to="/"
          target="_blank"
          className="px-2 py-2 text-sm font-medium hover:text-syria-terracotta transition-colors"
        >
          زيارة الموقع
        </Link>
      </div>
      <div className="p-4">
        <h2 className="text-xl font-bold">لوحة التحكم</h2>
      </div>
      <nav>
        <ul className="flex flex-wrap md:grid">
          <li>
            <NavLink 
              to="/admin/users" 
              className={({ isActive }) => `flex items-center p-2 ${isActive ? 'bg-gray-700 text-white' : 'hover:bg-gray-700'}`}
            >
              <Users className="mr-2" />
              المستخدمين
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/admin/cars" 
              className={({ isActive }) => `flex items-center p-2 ${isActive ? 'bg-gray-700 text-white' : 'hover:bg-gray-700'}`}
            >
              <Car className="mr-2" />
              السيارات
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/admin/stores" 
              className={({ isActive }) => `flex items-center p-2 ${isActive ? 'bg-gray-700 text-white' : 'hover:bg-gray-700'}`}
            >
              <Store className="mr-2" />
              المتاجر
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/admin/categories" 
              className={({ isActive }) => `flex items-center p-2 ${isActive ? 'bg-gray-700 text-white' : 'hover:bg-gray-700'}`}
            >
              <Tag className="mr-2" />
              التصنيفات
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/admin/workshops" 
              className={({ isActive }) => `flex items-center p-2 ${isActive ? 'bg-gray-700 text-white' : 'hover:bg-gray-700'}`}
            >
              <Wrench className="mr-2" />
              الورشات
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
