import { Outlet, NavLink, useNavigate } from "react-router-dom";
import "./profile.css";
import { useDispatch} from "react-redux";
import { logout } from "../../redux/slice/authSlice";
import {
  FaUser,
  FaCalendarAlt,
  FaComments,
  FaCog,
} from "react-icons/fa";
import { FaSignOutAlt } from "react-icons/fa";
import Footer from "../../components/footer/Footer";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="profile-layout">
      <aside className="profile-sidebar">
        {/* <h2 className="profile-logo">Telemedicine</h2> */}
        <nav className="profile-nav">
          <NavLink
            to="/profile/myProfile"
            className={({ isActive }) =>
              isActive ? "profile-active-link" : ""
            }
          >
            <FaUser /> Mənim Profilim
          </NavLink>
          <NavLink
            to="/profile/appointmentP"
            className={({ isActive }) =>
              isActive ? "profile-active-link" : ""
            }
          >
            <FaCalendarAlt /> Görüşlərim
          </NavLink>
          <NavLink
            to="/profile/messagesP"
            className={({ isActive }) =>
              isActive ? "profile-active-link" : ""
            }
          >
            <FaComments /> Mesajlar
          </NavLink>
          <NavLink
            to="/profile/settingP"
            className={({ isActive }) =>
              isActive ? "profile-active-link" : ""
            }
          >
            <FaCog /> Tənzimləmələr
          </NavLink>
          <button className="profile-logout-btn" onClick={handleLogout}>
            <FaSignOutAlt /> Çıxış
          </button>
        </nav>
      </aside>

      <main className="profile-main">
        <div className="profile-content">
          <Outlet />
        </div>
        <Footer/>
        
      </main>
    </div>
  );
};

export default Profile;
