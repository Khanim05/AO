import React from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FiBell } from "react-icons/fi";
import { clearNotification } from "../../redux/slice/notificationSlice";
import "./mobileSidebar.css";
import Logo from "../logo/Logo";

const MobileSidebar = ({ closeSidebar }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const role = user?.role;
  const hasNotification = useSelector((state) => state.notification.hasNotification);

  const handleNotifClick = () => {
    dispatch(clearNotification());
    closeSidebar();
    if (role === "Patient") {
      navigate("/profile/messagesP");
    } else {
      navigate("/doctor/messagesD");
    }
  };

  return (
    <motion.div
      className="mobile-sidebar"
      initial={{ x: "-100%" }}
      animate={{ x: 0 }}
      exit={{ x: "-100%" }}
      transition={{ duration: 0.3 }}
    >
      <div className="sidebar-header">
        <div className="sidebar-header-left">
          <Logo />
          {user && (role === "Patient" || role === "Doctor") && (
            <div className="notif-wrapper-mobile" onClick={handleNotifClick}>
              <FiBell className="notif-icon-mobile" />
              {hasNotification && <span className="notif-dot ping"></span>}
            </div>
          )}
        </div>

        <span className="close-btn" onClick={closeSidebar}>✖</span>
      </div>

      <ul className="sidebar-links">
        <li><Link to="/" onClick={closeSidebar}>Ana Səhifə</Link></li>
        <li><Link to="/about" onClick={closeSidebar}>Haqqımızda</Link></li>
        <li><Link to="/doctors" onClick={closeSidebar}>Həkimlərimiz</Link></li>
        <li><Link to="/contact" onClick={closeSidebar}>Əlaqə</Link></li>
      </ul>

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
        {user && role === "Doctor" && (
          <Link to="/doctor" onClick={closeSidebar}>
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
        <a href="#"><i className="fa-brands fa-facebook icon"></i></a>
        <a href="#"><i className="fa-brands fa-twitter icon"></i></a>
        <a href="#"><i className="fa-brands fa-instagram icon"></i></a>
        <a href="#"><i className="fa-brands fa-linkedin icon"></i></a>
      </div>
    </motion.div>
  );
};

export default MobileSidebar;
