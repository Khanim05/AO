import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useState } from "react";
import "./step3D.css";

const Step3Doctor = ({ prevStep, formData, setFormData }) => {
  const navigate = useNavigate();
  const [previewUrl, setPreviewUrl] = useState(
    formData.ProfileImage ? URL.createObjectURL(formData.ProfileImage) : null
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      Name,
      Surname,
      Email,
      BirthDate,
      CategoryId,
      LicenseNumber,
      Password,
      ConfirmPassword,
      ProfileImage,
    } = formData;

    const data = new FormData();
    data.append("Name", Name);
    data.append("Surname", Surname);
    data.append("Email", Email);
    data.append("BirthDate", new Date(BirthDate).toISOString());
    data.append("CategoryId", parseInt(CategoryId));
    data.append("LicenseNumber", LicenseNumber);
    data.append("Password", Password);
    data.append("ConfirmPassword", ConfirmPassword);
    if (ProfileImage) {
      data.append("ProfileImage", ProfileImage);
    }

    try {
      await axios.post(
        "https://khamiyevbabek-001-site1.ktempurl.com/api/Account/register/doctor",
        data
      );

      toast.success("Qeydiyyat uğurla tamamlandı, təsdiq üçün göndərildi.");
      localStorage.removeItem("doctorForm");
      localStorage.removeItem("doctorStep");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error("Qeydiyyat xətası:", error);
      const message =
        error.response?.data?.message ||
        error.response?.data ||
        "Qeydiyyat zamanı xəta baş verdi.";
      toast.error(message);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      ProfileImage: file,
    }));
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  return (
    <form className="photo-upload-container" onSubmit={handleSubmit}>
      <h2>Profil şəklinizi seçin</h2>

      <label className="image-upload-label">
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {previewUrl ? (
          <img src={previewUrl} alt="Profil" />
        ) : (
          <div className="upload-placeholder">
            <span className="camera-icon">📷</span>
            <span className="upload-text">Şəkil seçin</span>
          </div>
        )}
      </label>

      <div className="step-buttons-row">
        <button type="button" className="back-button" onClick={prevStep}>
          Geri
        </button>
        <button type="submit" className="upload-button">
          Təsdiqlə və tamamla
        </button>
      </div>
    </form>
  );
};

export default Step3Doctor;
