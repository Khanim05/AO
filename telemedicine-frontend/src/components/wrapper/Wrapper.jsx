import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import "./wrapper.css"
const Wrapper = () => {
  const { token, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [fadeOut, setFadeOut] = useState(false);
  const [targetRoute, setTargetRoute] = useState("");

  const handleClick = (path) => {
    setTargetRoute(path);
    setFadeOut(true);
  };

  React.useEffect(() => {
    if (fadeOut && targetRoute) {
      const timeout = setTimeout(() => {
        navigate(targetRoute);
      }, 400);
      return () => clearTimeout(timeout);
    }
  }, [fadeOut, targetRoute, navigate]);

  return (
    <motion.div
      className="sign-area"
      initial={{ opacity: 1, scale: 1 }}
      animate={{ opacity: fadeOut ? 0 : 1, scale: fadeOut ? 0.95 : 1 }}
      transition={{ duration: 0.4 }}
    >
      {token && user?.role === "Patient" ? (
        <button className="btnLogin" onClick={() => handleClick("/profile")}>
          Profil
        </button>
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
