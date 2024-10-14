"use client";
import { useEffect, useRef, useState } from "react";
import SidebarAdmin from "../sidebar/SidebarAdmin";
import Image from "next/image";

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const buttonRef = useRef(null);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    if (
      sidebarRef.current &&
      !sidebarRef.current.contains(event.target) &&
      buttonRef.current &&
      !buttonRef.current.contains(event.target)
    ) {
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex">
      <div ref={sidebarRef}>
        <SidebarAdmin isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      </div>
      <div className="flex-grow p-6">
        {!isSidebarOpen && ( 
          <button
            onClick={toggleSidebar}
            className="md:hidden fixed top-4 left-4 z-50 p-1"
            ref={buttonRef}
          >
            <Image
              loading="lazy"
              src="/icones/menu-hamburguer.svg"
              alt="Menu"
              width={20}
              height={20}
            />
          </button>
        )}
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
