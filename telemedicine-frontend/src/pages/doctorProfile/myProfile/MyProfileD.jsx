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
        console.log("🔑 userId:", userId);

        // 1. Approved olanları gətir
        const approvedRes = await axios.get(
          "https://khamiyevbabek-001-site1.ktempurl.com/api/DoctorProfile/approved",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // 2. Token userId ilə uyğun olan profili tap
        const foundProfile = approvedRes.data.find((p) => p.userId === userId);

        if (!foundProfile) {
          console.warn("Profil tapılmadı!");
          return;
        }

        const profileId = foundProfile.id;

        // 3. Bu id ilə əsas profil məlumatını çək
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

  if (!doctor) {
    return <div className="doctor-loading">Yüklənir...</div>;
  }

  return (
    <div className="doctor-profile-container">
      <div className="profile-header">
        <img
          src={doctor.imgUrl || "/default-avatar.png"}
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
          <span>{new Date(doctor.birthDate).toLocaleDateString()}</span>
        </div>
        <div className="profile-card">
          <span className="label">Profil yaradılma:</span>
          <span>{new Date(doctor.createProfil).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
