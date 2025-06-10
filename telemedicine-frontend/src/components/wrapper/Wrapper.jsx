import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import "./wrapper.css"; // stil varsa
import Button from "react-bootstrap/Button";

const Wrapper = () => {
  const { token } = useSelector((state) => state.auth);

  return (
    <div className="wrapper">
      {token ? (
        <Link to="/profile" className="nav-link">
          Profil
        </Link>
      ) : (
        <>
          <div className="sign-area">
            <Link to="/login" className="nav-link">
              <Button variant="success" className="btnLogin">
                Daxil Ol
              </Button>
            </Link>
            <Link to="/register" className="nav-link">
              <Button variant="success" className="btnRegister">
                Qeydiyyat
              </Button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Wrapper;
