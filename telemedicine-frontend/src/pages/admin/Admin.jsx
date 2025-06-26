import React, { useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/slice/authSlice";
import {
  FaUser,
  FaStethoscope,
  FaSignOutAlt,
  FaChevronDown,
  FaChevronUp,
  FaTachometerAlt,
  FaEnvelopeOpenText,
} from "react-icons/fa";
import "./admin.css";
import DarkMode from "../../components/darkMode/DarkMode";

const Admin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [doctorDropdown, setDoctorDropdown] = useState(false);
  const [contactDropdown, setContactDropdown] = useState(false); // ✅ Əlaqə dropdownu

  const handleLogout = () => {
    dispatch(logout());
    navigate("/", { replace: true });
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-header">
          <div className="header-2">
            <div className="admin-avatar">A</div>
            <span>Admin</span>
          </div>

          <DarkMode className="dark-mode" />
        </div>
        <nav className="admin-nav">
          <NavLink to="/admin/dashboard" className="admin-link">
            <FaTachometerAlt /> Dashboard
          </NavLink>

          <NavLink to="/admin/users" className="admin-link">
            <FaUser /> Users
          </NavLink>

          {/* 🩺 Doctors Dropdown */}
          <div className="admin-dropdown">
            <div
              className="admin-dropdown-header"
              onClick={() => setDoctorDropdown(!doctorDropdown)}
            >
              <span>
                <FaStethoscope /> Doctors
              </span>
              {doctorDropdown ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            <div
              className={`admin-dropdown-body ${doctorDropdown ? "open" : ""}`}
            >
              {doctorDropdown && (
                <>
                  <NavLink to="/admin/accept-doctor" className="admin-sublink">
                    Accepted Doctors
                  </NavLink>
                  <NavLink to="/admin/pending-doctor" className="admin-sublink">
                    Pending Approval
                  </NavLink>
                  <NavLink to="/admin/doctor-seans" className="admin-sublink">
                    Seans Növü
                  </NavLink>
                </>
              )}
            </div>
          </div>

          {/* 📩 Contact Messages Dropdown */}
          <div className="admin-dropdown">
            <div
              className="admin-dropdown-header"
              onClick={() => setContactDropdown(!contactDropdown)}
            >
              <span>
                <FaEnvelopeOpenText /> Əlaqə Mesajları
              </span>
              {contactDropdown ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            <div
              className={`admin-dropdown-body ${contactDropdown ? "open" : ""}`}
            >
              {contactDropdown && (
                <>
                  <NavLink to="/admin/contact-messages" className="admin-sublink">
                    Oxunmamış
                  </NavLink>
                  <NavLink to="/admin/read-messages" className="admin-sublink">
                    Oxunmuş
                  </NavLink>
                </>
              )}
            </div>
          </div>

          <button className="admin-logout" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </nav>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
};

export default Admin;
