import "./list.css";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

const List = ({ scrollToContact }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleContactClick = (e) => {
    e.preventDefault();

    if (location.pathname === "/") {
      scrollToContact(); // Ana səhifədədirsə, scroll et
    } else {
      navigate("/#contact"); // Başqa səhifədədirsə, yönləndir
    }
  };

  return (
    <div id="list-area">
      <ul className="list-area">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive && location.hash !== "#contact"
                ? "nav-link active"
                : "nav-link"
            }
          >
            Ana Səhifə
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Haqqımızda
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/doctors"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Həkimlərimiz
          </NavLink>
        </li>
        <li>
          <a
            href="#contact"
            onClick={handleContactClick}
            className={`nav-link ${
              location.hash === "#contact" && location.pathname === "/"
                ? "active"
                : ""
            }`}
          >
            Əlaqə
          </a>
        </li>
      </ul>
    </div>
  );
};

export default List;
