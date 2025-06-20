import React, { useEffect, useState } from "react";
import axios from "axios";
import "./accept.css";
import { toast, ToastContainer } from "react-toastify";
import { FaTrash } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";

const AcceptDoctor = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://khamiyevbabek-001-site1.ktempurl.com/api/DoctorProfile/approved")
      .then((res) => setDoctors(res.data))
      .catch((err) => {
        console.error("Həkimləri yükləmə xətası:", err);
        toast.error("Həkimləri yükləmək mümkün olmadı.");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://khamiyevbabek-001-site1.ktempurl.com/api/DoctorProfile/${id}`);
      setDoctors((prev) => prev.filter((doc) => doc.id !== id));
      toast.success("Həkim silindi");
    } catch (error) {
      toast.error("Silinmə zamanı xəta baş verdi");
      console.error(error);
    }
  };

  return (
    <div className="accept-doctor-page">
      <ToastContainer />
      <h2 className="page-title">Təsdiqlənmiş Həkimlər</h2>

      {loading ? (
        <p className="loading-text">Yüklənir...</p>
      ) : doctors.length === 0 ? (
        <p className="no-doctors">Heç bir təsdiqlənmiş həkim yoxdur.</p>
      ) : (
        <div className="doctor-grid">
          {doctors.map((doc) => (
            <div className="doctor-card" key={doc.id}>
              <button className="delete-icon" onClick={() => handleDelete(doc.id)}>
                <FaTrash size={14} />
              </button>
              <img
                src={
                  doc.imgUrl
                    ? `${doc.imgUrl}`
                    : "/default-doctor.jpg"
                }
                alt="Doctor"
                className="doctor-photo"
              />
              <div className="doctor-name">{doc.name} {doc.surname}</div>
              <div className="doctor-meta">{doc.categoryName}</div>
              <div className="doctor-meta"><strong>Lisenziya:</strong> {doc.licenseNumber}</div>
              <div className="doctor-meta"><strong>Doğum:</strong> {new Date(doc.birthDate).toLocaleDateString()}</div>
              <div className="doctor-meta"><strong>Qeydiyyat: </strong>{new Date(doc.createProfil).toLocaleDateString()}</div>
              <span className="status-badge"><FaCheck className="check"
               /> Təsdiqlənmiş</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AcceptDoctor;
