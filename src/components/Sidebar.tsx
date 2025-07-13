import { Package, ShoppingCart, Zap } from "lucide-react";
import React from "react";
import { NavLink } from "react-router-dom";

const menuItems = [
  { id: "combo-creator", label: "Tạo Combo thông minh", icon: Zap, path: "/combo-creator" },
  { id: "combo-management", label: "Quản lý Combo", icon: Package, path: "/combo-management" },
];

const Sidebar: React.FC = () => {
  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-xl border-r border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <ShoppingCart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Smart Combo</h1>
            <p className="text-sm text-gray-500">Management System</p>
          </div>
        </div>
      </div>

      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ` +
                    (isActive
                      ? "bg-blue-50 text-blue-700 shadow-sm"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900")
                  }
                >
                  <Icon className={`w-5 h-5`} />
                  <span className="font-medium text-sm">{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
