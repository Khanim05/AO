import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUser, FaCheckCircle } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "./users.css";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://khamiyevbabek-001-site1.ktempurl.com/api/users")
      .then((res) => setUsers(res.data))
      .catch((err) => {
        console.error("İstifadəçilər yüklənə bilmədi:", err);
        toast.error("İstifadəçiləri yükləmək mümkün olmadı.");
      })
      .finally(() => setLoading(false));
  }, []);



  return (
    <div className="user-page">
      <ToastContainer />
      <h2 className="page-title">Qeydiyyatdan Keçmiş İstifadəçilər</h2>

      {loading ? (
        <p className="loading-text">Yüklənir...</p>
      ) : users.length === 0 ? (
        <p className="no-users">İstifadəçi tapılmadı.</p>
      ) : (
        <div className="user-grid">
          {users.map((user) => {
            console.log(user); // <-- BURAYA ƏLAVƏ ET

            return (
              <div className="user-card" key={user.id}>
                {user.imgUrl ? (
                  <img src={user.imgUrl} alt="User" className="user-photo" />
                ) : (
                  <div className="user-icon-avatar">
                    <FaUser size={28} />
                  </div>
                )}

                <div className="user-info">
                  <h3>
                    {user.name} {user.surname}
                  </h3>
                  <p>
                    <strong>Email:</strong> {user.email}
                  </p>
                  <p>
                    <strong>Doğum tarixi:</strong>{" "}
                    {new Date(user.birthDate).toLocaleDateString()}
                  </p>
                </div>

                <div className="status-badge user-status">
                  <FaCheckCircle className="check" /> Təsdiqlənmiş
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Users;
