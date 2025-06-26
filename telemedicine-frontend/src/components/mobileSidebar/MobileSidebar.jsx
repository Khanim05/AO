// components/mobileSidebar/MobileSidebar.jsx

import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "./mobileSidebar.css";
import Logo from "../logo/Logo";
import { useSelector } from "react-redux";

const MobileSidebar = ({ closeSidebar }) => {
  const user = useSelector((state) => state.auth.user);
  const role = user?.role; // buradan role gələ bilər: "Admin", "Doctor", "Patient"
  return (
    <motion.div
      className="mobile-sidebar"
      initial={{ x: "-100%" }}
      animate={{ x: 0 }}
      exit={{ x: "-100%" }}
      transition={{ duration: 0.3 }}
    >
      <div className="sidebar-header">
        <Logo />
        <span className="close-btn" onClick={closeSidebar}>
          ✖
        </span>
      </div>

      <ul className="sidebar-links">
        <li>
          <Link to="/" onClick={closeSidebar}>
            Ana Səhifə
          </Link>
        </li>
        <li>
          <Link to="/about" onClick={closeSidebar}>
            Haqqımızda
          </Link>
        </li>
        <li>
          <Link to="/doctors" onClick={closeSidebar}>
            Həkimlərimiz
          </Link>
        </li>
        <li>
          <Link to="/contact" onClick={closeSidebar}>
            Əlaqə
          </Link>
        </li>
      </ul>
      {/* <button className="btnLogin" onClick={() => handleClick("/profile")}>
          Profil
        </button> */}
      <div className="sidebar-buttons">
        {!user && (
          <>
            <Link to="/login" onClick={closeSidebar}>
              <button className="btnLogin">Daxil Ol</button>
            </Link>
            <Link to="/register" onClick={closeSidebar}>
              <button className="btnRegister">Qeydiyyat</button>
            </Link>
          </>
        )}

        {user && role === "Patient" && (
          <Link to="/profile" onClick={closeSidebar}>
            <button className="btnLogin">Profil</button>
          </Link>
        )}
      </div>

      <div className="sidebar-contact">
        <p>📞 050-123-45-67</p>
        <p>📍 Bakı şəhəri</p>
        <p>⏰ Hər gün 09:00 - 18:00</p>
      </div>

      <div className="sidebar-social">
        <a href="#">
          <i className="fa-brands fa-facebook icon"></i>
        </a>
        <a href="#">
          <i className="fa-brands fa-twitter icon"></i>
        </a>
        <a href="#">
          <i className="fa-brands fa-instagram icon"></i>
        </a>
        <a href="#">
          <i className="fa-brands fa-linkedin icon"></i>
        </a>
      </div>
    </motion.div>
  );
};

export default MobileSidebar;
