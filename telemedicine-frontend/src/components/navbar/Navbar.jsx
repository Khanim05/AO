// components/navbar/Navbar.jsx
import React, { useState } from "react";
import Logo from "../logo/Logo";
import List from "../list/List";
import Wrapper from "../wrapper/Wrapper";
import { AnimatePresence } from "framer-motion";
import MobileSidebar from "../mobileSidebar/MobileSidebar";
import "./navbar.css";
import DarkMode from "../darkMode/DarkMode";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="navbar-area">
      <div className="navbar-container container">
        {/* Logo yalnız menyu bağlıykən görünür */}
        {!menuOpen && <Logo />}

        {/* Desktop görünüşü */}
        <div className="nav-desktop">
          <List />
          <Wrapper />
        </div>
        <DarkMode />

        {/* Mobil menyu açma düyməsi */}
        {!menuOpen && (
          <div className="menu-toggle" onClick={() => setMenuOpen(true)}>
            ☰
          </div>
        )}
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {menuOpen && <MobileSidebar closeSidebar={() => setMenuOpen(false)} />}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
