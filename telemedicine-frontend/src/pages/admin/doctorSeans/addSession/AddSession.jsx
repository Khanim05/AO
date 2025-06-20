import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "./AddSession.css";

const AddSession = ({ onClose }) => {
  const [name, setName] = useState("");

  const handleAddSession = async () => {
    if (!name.trim()) {
      toast.warning("Seans adı boş ola bilməz");
      return;
    }

    try {
      await axios.post("https://khamiyevbabek-001-site1.ktempurl.com/api/DoctorCategory", {
        name,
      });
      toast.success("Seans növü uğurla əlavə edildi");
      setName("");
      onClose(); // modalı bağla
    } catch (err) {
      toast.error("Əlavə edilərkən xəta baş verdi");
      console.error(err);
    }
  };

  return (
    <div className="session-modal">
      <ToastContainer/>
      <div className="session-modal-content">
        <h3>Yeni Seans Növü Əlavə Et</h3>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Seans növü adı"
        />
        <div className="session-modal-buttons">
          <button onClick={handleAddSession}>Əlavə Et</button>
          <button className="cancel-btn" onClick={onClose}>Ləğv Et</button>
        </div>
      </div>
    </div>
  );
};

export default AddSession;

