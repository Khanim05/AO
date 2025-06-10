import "./list.css";
import { Link } from "react-router-dom";
const List = () => {
  return (
    <div id="list-area">

        <ul className="list-area">
        <li>
          <Link to="/">Ana Səhifə</Link>
        </li>
        <li>
          <Link to="/about">Haqqımızda</Link>
        </li>
        <li>
          <Link to="/doctors">Həkimlərimiz</Link>
        </li>
       <li>
        <Link to='/blog'>Bloq
        </Link>
       </li>
        <li>
          <Link to="/contact">Contact</Link>
        </li>
      </ul>  
    </div>
  );
};

export default List;
