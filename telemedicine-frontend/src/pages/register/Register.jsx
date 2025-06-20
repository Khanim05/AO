import { useNavigate } from "react-router-dom";
import Roleselect from "../../components/roleSelect/Roleselect";
import "./register.css";
import { motion } from "framer-motion";

const Register = () => {
  const navigate = useNavigate();

  const handleSelect = (role) => {
    navigate(`/register/${role}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="register-page"
    >
      <Roleselect handleSelect={handleSelect} />
    </motion.div>
  );
};

export default Register;
