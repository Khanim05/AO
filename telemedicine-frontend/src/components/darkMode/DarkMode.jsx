import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleDarkMode } from "../../redux/slice/authSlice";
import { Sun, Moon } from "lucide-react";
const DarkMode = () => {
  const dark = useSelector((state) => state.auth.darkMode);
  const dispatch = useDispatch();

  useEffect(() => {
    if (dark) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [dark]);
  return (
    <button
      onClick={() => dispatch(toggleDarkMode())}
      style={{
        fontSize: "20px",
        background: "transparent",
        border: "none",
        cursor: "pointer",
        color: "inherit",
        transition: "transform 0.2s ease",
      }}
      title={dark ? "Qaranlıq rejim" : "İşıq rejimi"}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      {dark ? <Moon size={30} /> : <Sun size={30} />}
    </button>
  );
};

export default DarkMode;
