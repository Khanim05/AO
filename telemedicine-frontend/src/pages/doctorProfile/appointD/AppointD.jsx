import React, { useEffect, useState } from "react";
import axios from "axios";
import "./appointD.css";
import { ToastContainer, toast } from 'react-toastify';

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

  const now = new Date();
  const upcomingAppointments = appointments.filter(
    (item) => new Date(item.endTime) > now
  );

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

  const handleJoinMeeting = async (appointmentId) => {
    try {
      const token = localStorage.getItem("token");
      console.log("🔐 Token:", token);

      const canJoinRes = await axios.get(
        `https://khamiyevbabek-001-site1.ktempurl.com/api/Meeting/canjoin/${appointmentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!canJoinRes.data) {
        toast.info("Hələ görüş vaxtı çatmayıb.");
        return;
      }

      const startRes = await axios.post(
        `https://khamiyevbabek-001-site1.ktempurl.com/api/Meeting/start/${appointmentId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const roomId = startRes.data;
      if (roomId) {
        window.location.href = `/video-call/${roomId}`;
      } else {
        alert("Otaq ID alına bilmədi.");
      }
    } catch (err) {
      console.error("Zəngə qoşulma zamanı xəta:", err);
      alert("Zəngə qoşulmaq mümkün olmadı.");
    }
  };

  return (
    <div className="appointments-wrapper">
      <h2 className="welcome-text">Pasiyentlərlə Görüşlər</h2>
      <div className="appointments-grid">
        <div className="appointment-section">
          <h3 className="section-title">Görüşlər</h3>

          {upcomingAppointments.length === 0 ? (
            <p className="no-appointments">Yaxın gələcəkdə görüş tapılmadı.</p>
          ) : (
            <ul className="appointments-list">
              {upcomingAppointments.map((item) => (
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
                    <button
                      className="join-button"
                      onClick={() => handleJoinMeeting(item.id)}
                    >
                      Zəngə qoşul
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <ToastContainer/>
    </div>
  );
};

export default AppointD;
