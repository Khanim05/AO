import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/slice/authSlice";
import "./doctorProfile.css";
import Footer from "../../components/footer/Footer";

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
      {/* Sidebar */}
      <aside className="doctor-sidebar">
        <nav className="doctor-nav">
          <NavLink
            to="/doctor/myProfileDoctor"
            className={({ isActive }) => (isActive ? "doctor-active-link" : "")}
          >
            Mənim Profilim
          </NavLink>
          <NavLink
            to="/doctor/appointmentD"
            className={({ isActive }) => (isActive ? "doctor-active-link" : "")}
          >
           Görüşlərim
          </NavLink>
          <NavLink
            to="/doctor/messagesD"
            className={({ isActive }) => (isActive ? "doctor-active-link" : "")}
          >
            Mesajlarım
          </NavLink>
          <NavLink
            to="/doctor/settingD"
            className={({ isActive }) => (isActive ? "doctor-active-link" : "")}
          >
            Tənzimləmələr
          </NavLink>
          <button className="doctor-logout-btn" onClick={handleLogout}>
            Çıxış
          </button>
        </nav>
      </aside>
      {/* Content */}
      <main className="doctor-main">
        <div className="doctor-content">
          <Outlet />
        </div>
        <Footer/>
      </main>
    </div>
  );
};

export default DoctorProfile;
