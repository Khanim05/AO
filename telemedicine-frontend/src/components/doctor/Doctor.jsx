import "./doctor.css";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Doctor = ({
  name,
  surname,
  imgUrl,
  licenseNumber,
  categoryName,
  userId,
}) => {
  const navigate = useNavigate();
  const handleViewDetails = () => {
    navigate("/doctors", {
      state: { highlightedDoctorId: userId }, 
    });
  };
  return (
    <motion.div className="doctor-card" whileHover={{ scale: 1.05 }}>
      <div className="doctor-image">
        <img src={imgUrl ? imgUrl : "/default-doctor.jpg"} alt={name} />

        <div className="overlay">
          <button className="overlay-button" onClick={handleViewDetails}>
            Ətraflı bax
          </button>
        </div>
      </div>
      <h3>
        Dr.{name} {surname}
      </h3>
      <p>{licenseNumber} illik təcrübə</p>
      <span>{categoryName} </span>
    </motion.div>
  );
};

export default Doctor;
