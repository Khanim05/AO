import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import './restore.css'
const RestoreSession = ({ onClose }) => {
  const [deletedSessions, setDeletedSessions] = useState([]);
  console.log("🔁 RestoreSession render edildi", deletedSessions);

  useEffect(() => {
    fetchDeleted();
  }, []);

  const fetchDeleted = async () => {
    try {
      const res = await axios.get("https://khamiyevbabek-001-site1.ktempurl.com/api/DoctorCategory/all");

      // 🔍 YALNIZ isDeleted = true olanlar
      const filtered = res.data.filter((cat) => cat.isDeleted === true);
      setDeletedSessions(filtered);
    } catch (err) {
      toast.error("Silinmiş seans növləri gətirilə bilmədi");
    }
  };

  const handleRestore = async (id) => {
    try {
      await axios.put(`https://khamiyevbabek-001-site1.ktempurl.com/api/DoctorCategory/${id}/Restore`);
      toast.success("Bərpa olundu");
      fetchDeleted(); // Yenidən silinmişləri çək
    } catch (err) {
      toast.error("Bərpa edilə bilmədi");
    }
  };

  return (
    <div className="modal">
      <h3>Silinmiş Seans Növləri</h3>
      <ul>
        {deletedSessions.length === 0 ? (
          <p>Heç bir silinmiş seans növü yoxdur</p>
        ) : (
          deletedSessions.map((cat) => (
            <li key={cat.id}>
              <span>{cat.name}</span>
              <button onClick={() => handleRestore(cat.id)}>Bərpa Et</button>
            </li>
          ))
        )}
      </ul>
      <button onClick={onClose}>Bağla</button>
    </div>
  );
};

export default RestoreSession;
