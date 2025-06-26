import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "./doctorProfile.css";

const DoctorProfile = () => {
  const [doctor, setDoctor] = useState(null);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const decoded = jwtDecode(token);
        const userId =
          decoded[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
          ];

        const approvedRes = await axios.get(
          "https://khamiyevbabek-001-site1.ktempurl.com/api/DoctorProfile/approved",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const foundProfile = approvedRes.data.find((p) => p.userId === userId);
        if (!foundProfile) {
          console.warn("Profil tapılmadı!");
          return;
        }

        const profileId = foundProfile.id;

        const res = await axios.get(
          `https://khamiyevbabek-001-site1.ktempurl.com/api/DoctorProfile/${profileId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setDoctor(res.data);
      } catch (err) {
        console.error("Profil yüklənə bilmədi:", err);
      }
    };

    fetchDoctor();
  }, []);

  const formatDateOnly = (dateInput) => {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return ""; // tarix səhvdirsə boş string ver

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const formatDateTime = (dateInput) => {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return "";

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
  };

  if (!doctor) {
    return <div className="doctor-loading">Yüklənir...</div>;
  }
  const birthDateFormatted = doctor.birthDate
    ? formatDateOnly(doctor.birthDate)
    : "";

  const createdAtFormatted = doctor.createProfil
    ? formatDateTime(doctor.createProfil)
    : "";

  return (
    <div className="doctor-profile-container">
      <div className="profile-header">
        <img
          src={
            doctor.imgUrl
              ? `${doctor.imgUrl}?v=${new Date().getTime()}`
              : "/default-avatar.png"
          }
          alt="doctor"
          className="profile-img"
        />
        <h2>
          {doctor.name} {doctor.surname}
        </h2>
      </div>

      <div className="profile-info-grid">
        <div className="profile-card">
          <span className="label">Təcrübə ili:</span>
          <span>{doctor.licenseNumber}</span>
        </div>
        <div className="profile-card">
          <span className="label">Seans növü:</span>
          <span>{doctor.categoryName}</span>
        </div>
        <div className="profile-card">
          <span className="label">Email:</span>
          <span>{doctor.email}</span>
        </div>
        <div className="profile-card">
          <span className="label">Doğum tarixi:</span>
          <span>{birthDateFormatted}</span>
        </div>

        <div className="profile-card">
          <span className="label">Profil yaradılma:</span>
          <span>{createdAtFormatted}</span>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
