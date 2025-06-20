import React, { useEffect, useState } from "react";
import axios from "axios";
import "./myProfile.css"; // stil istəyə görə

const Myprofile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          "https://khamiyevbabek-001-site1.ktempurl.com/api/users/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setProfile(response.data);
      } catch (err) {
        console.error("Profil məlumatları alınarkən xəta:", err);
        setError("Profil məlumatları yüklənə bilmədi.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <p>Yüklənir...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  console.log(profile.imgUrl);

  return (
    <div className="my-profile-container">
      <h2 className="section-title">Profil Məlumatları</h2>

      <div className="profile-photo-wrapper">
        <img
          src={profile.imgUrl ? profile.imgUrl : "/default-doctor.jpg"}
          alt="Profil şəkli"
          className="profile-photo"
        />
      </div>

      <p className="profile-name">
        {profile.name} {profile.surname}
      </p>

      <div className="profile-details">
        <div className="profile-card">
          <span className="label">Ad:</span>
          <span>{profile.name}</span>
        </div>
        <div className="profile-card">
          <span className="label">Soyad:</span>
          <span>{profile.surname}</span>
        </div>
        <div className="profile-card">
          <span className="label">Email:</span>
          <span>{profile.email}</span>
        </div>
        <div className="profile-card">
          <span className="label">Doğum tarixi:</span>
          <span>
            {(() => {
              const date = new Date(profile.birthDate);
              const day = String(date.getDate()).padStart(2, "0");
              const month = String(date.getMonth() + 1).padStart(2, "0");
              const year = date.getFullYear();
              return `${day}.${month}.${year}`;
            })()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Myprofile;
