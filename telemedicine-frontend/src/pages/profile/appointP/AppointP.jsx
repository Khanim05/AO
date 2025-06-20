import React, { useEffect, useState } from "react";
import axios from "axios";
import "./appoint.css";

const statusMap = {
  0: "Gözləmədə",
  1: "Təsdiqlənib",
  2: "Ləğv edilib",
};

const AppointP = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/Schedule/patient", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(res.data);
    } catch (err) {
      console.error("Görüşləri yükləmək mümkün olmadı:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserName = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "https://khamiyevbabek-001-site1.ktempurl.com/api/users/profile",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const { name } = res.data;
      setUserName(name);
    } catch (err) {
      console.error("İstifadəçi məlumatları alınmadı:", err);
    }
  };

  const cancelAppointment = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/Schedule/cancel/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAppointments();
    } catch (err) {
      console.error("Ləğv edilərkən xəta:", err);
    }
  };

  const formatDateTime = (dateStr) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
  };

  useEffect(() => {
    fetchAppointments();
    fetchUserName();
  }, []);

  const now = new Date();

  const activeAppointments = appointments.filter(
    (a) => (a.status === 0 || a.status === 1) && new Date(a.endTime) > now
  );

  const pastAppointments = appointments.filter(
    (a) => a.status === 2 || new Date(a.endTime) <= now
  );

  if (loading) return <p className="loading">Yüklənir...</p>;

  return (
    <div className="appointments-wrapper">
      <h2 className="welcome-text">Xoş gəldin, {userName} !</h2>

      <div className="appointments-grid">
        {/* Aktiv görüşlər */}
        <div className="appointment-section">
          <h3 className="section-title">Aktiv Görüşlər</h3>
          {activeAppointments.length === 0 ? (
            <p className="no-appointments">Hazırda aktiv görüş yoxdur.</p>
          ) : (
            <ul className="appointments-list">
              {activeAppointments.map((appt) => (
                <li key={appt.id} className="appointment-card active">
                  <div className="appointment-info">
                    <h4>{appt.doctorName}</h4>
                    <p><strong>Başlanğıc:</strong> {formatDateTime(appt.startTime)}</p>
                    <p><strong>Son:</strong> {formatDateTime(appt.endTime)}</p>
                    <p>
                      <span className={`status-badge status-${appt.status}`}>
                        {statusMap[appt.status]}
                      </span>
                    </p>
                  </div>
                  <div className="appointment-actions">
                    <button className="join-btn">Zəngə qoşul</button>
                    <button
                      className="cancel-btn"
                      onClick={() => cancelAppointment(appt.id)}
                    >
                      Ləğv et
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Keçmiş görüşlər */}
        <div className="appointment-section">
          <h3 className="section-title">Keçmiş və Ləğv Olunmuş Görüşlər</h3>
          {pastAppointments.length === 0 ? (
            <p className="no-appointments">Keçmiş görüş yoxdur.</p>
          ) : (
            <ul className="appointments-list">
              {pastAppointments.map((appt) => (
                <li key={appt.id} className="appointment-card past">
                  <div className="appointment-info">
                    <h4>{appt.doctorName}</h4>
                    <p><strong>Başlanğıc:</strong> {formatDateTime(appt.startTime)}</p>
                    <p><strong>Son:</strong> {formatDateTime(appt.endTime)}</p>
                    <p>
                      <span className={`status-badge status-${appt.status}`}>
                        {statusMap[appt.status]}
                      </span>
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

export default AppointP;
