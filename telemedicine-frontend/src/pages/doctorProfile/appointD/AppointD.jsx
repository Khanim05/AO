import React, { useEffect, useState } from "react";
import axios from "axios";
import "./appointD.css";

const AppointD = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchDoctorAppointments = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "https://khamiyevbabek-001-site1.ktempurl.com/api/Schedule/doctor",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAppointments(res.data);
      } catch (error) {
        console.error("Həkim görüşləri yüklənmədi:", error);
      }
    };

    fetchDoctorAppointments();
  }, []);
  const formatDateTime = (dateStr) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day}.${month}.${year} ${hours}:${minutes}`;
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
  };

  return (
    <div className="appointments-wrapper">
      <h2 className="welcome-text">Pasiyentlərlə Görüşlər</h2>
      <div className="appointments-grid">
        <div className="appointment-section">
          <h3 className="section-title">Görüşlər</h3>

          {appointments.length === 0 ? (
            <p className="no-appointments">Görüş tapılmadı.</p>
          ) : (
            <ul className="appointments-list">
              {appointments.map((item) => (
                <li className="appointment-card" key={item.id}>
                  <div className="appointment-info">
                    <img
                      src={item.patient?.imgUrl}
                      alt="Pasiyent şəkli"
                      style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        marginBottom: "12px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      }}
                    />
                    <h4>
                      {item.patient?.name} {item.patient?.surname}
                    </h4>
                    <p>
                      <strong>Doğum tarixi:</strong>{" "}
                      {item.patient?.birthDate
                        ? formatDate(item.patient.birthDate)
                        : "—"}
                    </p>

                    <p>
                      <strong>Başlama vaxtı:</strong>{" "}
                      {formatDateTime(item.startTime)}
                    </p>

                    <p>
                      <strong>Bitmə vaxtı:</strong>{" "}
                      {formatDateTime(item.endTime)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointD;
