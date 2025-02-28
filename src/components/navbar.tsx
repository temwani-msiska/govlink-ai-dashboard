"use client";

import Image from "next/image";
import { useState } from "react";
import { Bell, UserCircle } from "lucide-react"; // Icons

export default function Navbar() {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="w-full h-16 shadow-md flex items-center justify-between px-4 md:px-6 fixed top-0 left-0 right-0 z-50 bg-[#2f68bc]">
      {/* Left Section: Logo */}
      <div className="flex items-center gap-3">
        <Image src="/Logo Final.png" alt="GovLink AI Logo" width={50} height={50} className="rounded-full" />
      </div>

      {/* Center Section: Title (Hidden on Small Screens) */}
      <div className="hidden md:flex w-1/2 justify-center items-center bg-[#2f68bc]">
        <h1 className="text-lg md:text-2xl font-bold text-white text-center">GovLink AI Dashboard</h1>
      </div>

      {/* Right Section: Notifications & User Profile */}
      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <button className="relative">
          <Bell size={20} className="text-gray-600 hover:text-[#2f68bc]" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
        </button>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button onClick={() => setDropdownOpen(!isDropdownOpen)} className="flex items-center gap-2">
            <UserCircle size={24} className="text-gray-600" />
            <span className="hidden md:inline text-sm font-medium text-gray-700">Admin</span>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-md p-2">
              <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100">Profile</button>
              <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100">Settings</button>
              <button className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-100">Logout</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
