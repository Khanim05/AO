import React, { useState } from "react";
import "./registerPhoto.css";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const RegisterPhoto = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setSelectedImage(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async () => {
    if (!selectedImage) {
      toast.error("Zəhmət olmasa şəkil seçin!");
      return;
    }

    const step1Data = JSON.parse(localStorage.getItem("registerPatientData"));
    if (!step1Data) {
      toast.error("Qeydiyyat məlumatları tapılmadı!");
      return;
    }

    const formData = new FormData();
    formData.append("Name", step1Data.Name);
    formData.append("Surname", step1Data.Surname);
    formData.append("Email", step1Data.Email);
    formData.append("Password", step1Data.Password);
    formData.append("ConfirmPassword", step1Data.ConfirmPassword);
    formData.append("BirthDate", step1Data.BirthDate);
    formData.append("ProfileImage", selectedImage); 

    try {
      for (let pair of formData.entries()) {
        console.log(`${pair[0]}:`, pair[1]);
      }
      const response = await axios.post(
        "https://khamiyevbabek-001-site1.ktempurl.com/api/Account/register/patient",
        formData
      );

      localStorage.removeItem("registerPatientData");
      toast.success("Qeydiyyat tamamlandı!");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
      console.log(response, "qeydiyyat ugurludu");
    } catch (error) {
      if (error.response?.data) {
        console.error("BACKEND RESPONSE:", error.response.data);
        toast.error(
          error.response.data.message || "Qeydiyyat zamanı xəta baş verdi."
        );
      } else {
        console.error("Qeyri-müəyyən xəta:", error);
        toast.error("Naməlum xəta baş verdi.");
      }
    }
  };

  return (
    <div className="photo-upload-container">
      <ToastContainer autoClose={3000} />
      <div className="upload-card">
        <h2>Profil şəklinizi seçin</h2>
        <div className="image-preview">
          {preview ? (
            <img src={preview} alt="Profil şəkli" />
          ) : (
            <label htmlFor="photoInput" className="upload-placeholder">
              <i className="fa-solid fa-camera"></i>
              <span>Şəkil seçin</span>
            </label>
          )}
          <input
            type="file"
            id="photoInput"
            accept="image/*"
            onChange={handleImageChange}
            hidden
          />
        </div>
        <button onClick={handleSubmit} className="submit-photo-btn">
          Təsdiqlə və tamamla
        </button>
      </div>
    </div>
  );
};

export default RegisterPhoto;
