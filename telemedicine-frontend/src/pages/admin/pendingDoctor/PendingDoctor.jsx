import React, { useEffect, useState } from "react";
import axios from "axios";
import "./pending.css";
import { toast, ToastContainer } from "react-toastify";
import { FaCheck, FaTrash } from "react-icons/fa";

const PendingDoctors = () => {
  const [pendingDoctors, setPendingDoctors] = useState([]);

  useEffect(() => {
    axios
      .get(
        "https://khamiyevbabek-001-site1.ktempurl.com/api/DoctorProfile/not-approved"
      )
      .then((res) => setPendingDoctors(res.data))
      .catch((err) => {
        console.error(err);
        toast.error("Həkimləri çəkmək mümkün olmadı.");
      });
  }, []);

  const handleAccept = async (id) => {
    try {
      await axios.patch(
        `https://khamiyevbabek-001-site1.ktempurl.com/api/DoctorProfile/approve/${id}`
      );
      toast.success("Həkim təsdiqləndi");
      setPendingDoctors((prev) => prev.filter((doc) => doc.id !== id));
    } catch (error) {
      toast.error("Təsdiqləmə zamanı xəta baş verdi");
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `https://khamiyevbabek-001-site1.ktempurl.com/api/DoctorProfile/${id}`
      );
      toast.success("Həkim silindi");
      setPendingDoctors((prev) => prev.filter((doc) => doc.id !== id));
    } catch (error) {
      toast.error("Silinmə zamanı xəta baş verdi");
      console.error(error);
    }
  };

  return (
    <div className="pending-doctor-page">
      <ToastContainer />
      <h2 className="page-title">Təsdiq Gözləyən Həkimlər</h2>

      {pendingDoctors.length === 0 ? (
        <p className="no-doctors">Hazırda təsdiq gözləyən həkim yoxdur.</p>
      ) : (
        <div className="doctor-grid">
          {pendingDoctors.map((doc) => (
            <div className="doctor-card" key={doc.id}>
              <div className="doctor-actions">
                
                                  <button
                  className="accept-icon"
                  onClick={() => handleAccept(doc.id)}
                >
                  <FaCheck />
                </button>
                <button
                  className="delete-icon"
                  onClick={() => handleDelete(doc.id)}
                >
                  <FaTrash />
                </button>
              

              </div>

              <img
                src={
                  doc.imgUrl
                    ? `${doc.imgUrl}`
                    : "/default-doctor.jpg"
                }
                alt="Doctor"
                className="doctor-photo1"
              />
              <div className="doctor-name">
                {doc.name} {doc.surname}
              </div>
              <div className="doctor-meta">{doc.categoryName}</div>
              <div className="doctor-meta">
                <strong>Lisenziya:</strong> {doc.licenseNumber}
              </div>
              <div className="doctor-meta">
                <strong>Doğum:</strong>{" "}
                {new Date(doc.birthDate).toLocaleDateString()}
              </div>
              <div className="doctor-meta">
                <strong>Qeydiyyat:</strong>{" "}
                {new Date(doc.createProfil).toLocaleDateString()}
              </div>
              <span className="status-badge waiting">⏳ Təsdiq Gözləyir</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingDoctors;
