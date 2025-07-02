// ✅ doctor.jsx (tam duzeldilmis versiya)
import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "./doctor.css";
import ChatModal from "../../components/chatModal/ChatModal";
import Footer from "../../components/footer/Footer";
import { jwtDecode } from "jwt-decode";
import AppointmentModal from "../../components/Appoint/AppointmenModal";

const Doctor = () => {
  const [selectedDoctorForChat, setSelectedDoctorForChat] = useState(null);
  const [selectedDoctorForAppointment, setSelectedDoctorForAppointment] =
    useState(null);
  const [doctors, setDoctors] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const location = useLocation();
  const highlightedDoctorId = location.state?.highlightedDoctorId;
  console.log("🔍 Gələn doctor ID:", highlightedDoctorId);
  const cardRefs = useRef({}); // həkim kartları üçün ref-lər

  useEffect(() => {
    axios
      .get(
        "https://khamiyevbabek-001-site1.ktempurl.com/api/DoctorProfile/approved"
      )
      .then((res) => setDoctors(res.data))
      .catch((err) => console.error("Həkimlər yüklənmədi:", err));

    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      const role =
        decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      setUserRole(role);
    }
  }, []);

  useEffect(() => {
    if (highlightedDoctorId && doctors.length > 0) {
      const el = cardRefs.current[highlightedDoctorId];
      if (el) {
        setTimeout(() => {
           el.scrollIntoView({ behavior: "smooth", block: "center" });
          el.classList.add("highlight-doctor");

          setTimeout(() => {
            el.classList.remove("highlight-doctor");
          }, 3000);
        }, 100); // DOM render bitdikdən sonra
      }
    }
  }, [highlightedDoctorId, doctors]);

  return (
    <div className="section-area">
      <div className="doctor-section">
        <h1 className="section-heading"> Həkimlərimiz</h1>
        <div className="doctor-cards">
          {doctors.map((doctor) => (
            <div
              key={doctor.id}
              ref={(el) => (cardRefs.current[doctor.userId] = el)}
              className="doctor-item"
            >
              <img
                src={doctor.imgUrl}
                alt={doctor.name}
                className="doctor-avatar1"
              />
              <div className="doctor-details">
                <h2 className="doctor-name">
                  Dr. {doctor.name} {doctor.surname}
                </h2>
                <p className="doctor-field">
                  <strong>İxtisas:</strong> {doctor.categoryName}
                </p>
                <p className="doctor-license">
                  <strong>Təcrübə ili:</strong> {doctor.licenseNumber}
                </p>
                {userRole === "Patient" && (
                  <>
                    <button
                      className="book-btn"
                      onClick={() => setSelectedDoctorForAppointment(doctor)}
                    >
                      Görüş təyin et
                    </button>
                    <button
                      className="start-chat-btn"
                      onClick={() => setSelectedDoctorForChat(doctor)}
                    >
                      💬 Söhbətə başla
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedDoctorForChat && (
        <ChatModal
          doctor={selectedDoctorForChat}
          onClose={() => setSelectedDoctorForChat(null)}
        />
      )}

      {selectedDoctorForAppointment && (
        <AppointmentModal
          doctorId={selectedDoctorForAppointment.userId}
          doctorName={`Dr. ${selectedDoctorForAppointment.name} ${selectedDoctorForAppointment.surname}`}
          onClose={() => setSelectedDoctorForAppointment(null)}
        />
      )}

      <Footer />
    </div>
  );
};

export default Doctor;
