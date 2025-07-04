import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { clearNotification } from "../../redux/slice/notificationSlice";
import GlobalMessageListener from "../global/GlobalMessageListener";
import { FiBell } from "react-icons/fi"; // ✅ Bell icon
import "./wrapper.css";

const Wrapper = () => {
  const { token, user } = useSelector((state) => state.auth);
  const hasNotification = useSelector((state) => state.notification.hasNotification);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [fadeOut, setFadeOut] = useState(false);
  const [targetRoute, setTargetRoute] = useState("");

  const handleClick = (path) => {
    setTargetRoute(path);
    setFadeOut(true);
  };

  const handleRoute = () => {
    if (user?.role === "Patient") {
      handleClick("/profile");
    } else if (user?.role === "Doctor") {
      handleClick("/doctor");
    }
  };

  useEffect(() => {
    if (fadeOut && targetRoute) {
      const timeout = setTimeout(() => {
        navigate(targetRoute);
      }, 400);
      return () => clearTimeout(timeout);
    }
  }, [fadeOut, targetRoute, navigate]);

  const handleNotifClick = () => {
    dispatch(clearNotification());
    if (user?.role === "Patient") {
      navigate("/profile/messagesP");
    } else {
      navigate("/doctor/messagesD");
    }
  };

  useEffect(() => {
   
  }, [hasNotification]);

  return (
    <motion.div
      className="sign-area"
      initial={{ opacity: 1, scale: 1 }}
      animate={{ opacity: fadeOut ? 0 : 1, scale: fadeOut ? 0.95 : 1 }}
      transition={{ duration: 0.4 }}
    >
      <GlobalMessageListener />

      {token && (user?.role === "Patient" || user?.role === "Doctor") ? (
        <div className="profile-actions">
          {/* 👤 Profil düyməsi əvvəl */}
          <button className="btnLogin" onClick={handleRoute}>
            Profil
          </button>

          {/* 🔔 Bildiriş ikonu sonra */}
          <div className="notif-icon" onClick={handleNotifClick}>
            <FiBell size={23} />
            {hasNotification && <span className="notif-dot"></span>}
          </div>
        </div>
      ) : (
        <>
          {!token && (
            <>
              <button className="btnLogin" onClick={() => handleClick("/login")}>
                Daxil Ol
              </button>
              <button className="btnRegister" onClick={() => handleClick("/register")}>
                Qeydiyyat
              </button>
            </>
          )}
        </>
      )}
    </motion.div>
  );
};

export default Wrapper;
