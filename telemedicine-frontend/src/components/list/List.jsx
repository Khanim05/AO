import "./list.css";
import { Link, NavLink } from "react-router-dom";
const List = () => {
  return (
    <div id="list-area">
      <ul className="list-area">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
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
          <NavLink
            to="blog"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Bloq
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Əlaqə
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default List;
