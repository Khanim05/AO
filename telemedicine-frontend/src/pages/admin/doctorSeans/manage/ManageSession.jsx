import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "./ManageSession.css";

const ManageSession = ({ onClose }) => {
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        "https://khamiyevbabek-001-site1.ktempurl.com/api/DoctorCategory/all"
      );
      setCategories(res.data);
    } catch (err) {
      toast.error("Seans növlərini çəkmək mümkün olmadı");
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSoftDelete = async (id) => {
    try {
      await axios.delete(
        `https://khamiyevbabek-001-site1.ktempurl.com/api/DoctorCategory/${id}Hard`
      );
      toast.success("Seans növü silindi");
      fetchCategories();
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error("Silinmə zamanı xəta baş verdi");
    }
  };

  return (
    <div className="session-modal">
      <ToastContainer />
      <div className="session-modal-content">
        <h3>Seans Növlərini Sil</h3>

        {categories.length === 0 ? (
          <p>Seans növü tapılmadı.</p>
        ) : (
          <ul className="session-list">
            {categories.map((cat) => (
              <li key={cat.id}>
                <span>{cat.name}</span>
                <button onClick={() => handleSoftDelete(cat.id)}>Sil</button>
              </li>
            ))}
          </ul>
        )}

        <button className="cancel-btn" onClick={onClose}>
          Bağla
        </button>
      </div>
    </div>
  );
};

export default ManageSession;
