import { useState } from "react";
import "./doctor.css";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import AppointmentModal from "../Appoint/AppointmenModal";
const Doctor = ({
  name,
  surname,
  imgUrl,
  licenseNumber,
  categoryName,
  userId,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = () => {
    const isLoggedIn = localStorage.getItem("token"); // və ya reduxdan
    if (!isLoggedIn) {
      toast.error("Görüş təyin etmək üçün giriş etməlisiniz.");
      return;
    }
    setIsModalOpen(true);
  };
  return (
    <motion.div className="doctor-card" whileHover={{ scale: 1.05 }}>
      <div className="doctor-image">
        <ToastContainer />
        <img src={imgUrl ? imgUrl : "/default-doctor.jpg"} alt={name} />

        <div className="overlay">
          <Link to="/doctors" className="overlay-button">
            Ətraflı bax
          </Link>
          <button className="overlay-button" onClick={handleOpenModal}>
            Görüş təyin et
          </button>
        </div>
      </div>
      <h3>
        Dr.{name} {surname}
      </h3>
      <p>{licenseNumber} illik təcrübə</p>
      <span>{categoryName} </span>

      {/* Modal burda yerləşdiriləcək */}
      {isModalOpen && (
        <AppointmentModal
          doctorId={userId}
          doctorName={`Dr. ${name} ${surname}`} // bunu əlavə et
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </motion.div>
  );
};

export default Doctor;
