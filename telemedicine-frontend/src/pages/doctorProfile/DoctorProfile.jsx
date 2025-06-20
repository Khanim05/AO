import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/slice/authSlice";
import "./doctorProfile.css"; // fərqli stil faylı

const DoctorProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="doctor-layout">
      {/* SOL MENU */}
      <aside className="doctor-sidebar">
        <h2>Doctor Panel</h2>
        <nav className="doctor-nav">
          <NavLink
            to="/doctor/myProfileDoctor"
            className={({ isActive }) => (isActive ? "doctor-active-link" : "")}
          >
            My Profile
          </NavLink>
          <NavLink
            to="/doctor/appointmentD"
            className={({ isActive }) => (isActive ? "doctor-active-link" : "")}
          >
            Appointment
          </NavLink>
          <NavLink
            to="/doctor/messagesD"
            className={({ isActive }) => (isActive ? "doctor-active-link" : "")}
          >
            Messages
          </NavLink>
          <NavLink
            to="/doctor/settingD"
            className={({ isActive }) => (isActive ? "doctor-active-link" : "")}
          >
            Settings
          </NavLink>
          <button className="doctor-logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </nav>
      </aside>

      {/* SAĞ TƏRƏF */}
      <main className="doctor-main">
        <Outlet />
      </main>
    </div>
  );
};

export default DoctorProfile;
