import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./setting.css";

const Setting = () => {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    birthDate: "",
    imgUrl: "",
    email: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "https://khamiyevbabek-001-site1.ktempurl.com/api/users/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setFormData(res.data);
      } catch (error) {
        toast.error("Profil məlumatları yüklənə bilmədi.");
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataCloud = new FormData();
    formDataCloud.append("file", file);
    formDataCloud.append("upload_preset", "your_upload_preset"); // dəyiş
    formDataCloud.append("cloud_name", "dpa4msrgz");

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dpa4msrgz/image/upload",
        formDataCloud
      );

      const fullUrl = res.data.secure_url;
      const shortPath = fullUrl.slice(fullUrl.indexOf("telemedicine"));

      setFormData((prev) => ({
        ...prev,
        imgUrl: shortPath,
      }));

      toast.success("Qısa yol ilə şəkil yükləndi ✅");
    } catch (err) {
      toast.error("Yükləmə alınmadı ❌");
      console.error("Upload error:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "https://khamiyevbabek-001-site1.ktempurl.com/api/users/profile",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Profil məlumatları uğurla yeniləndi.");
    } catch (err) {
      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Yeniləmə zamanı xəta baş verdi.");
      }
    }
  };

  if (loading) return <p>Yüklənir...</p>;

  return (
    <div className="setting-container">
      <ToastContainer />
      <h2>Profil Məlumatlarını Dəyiş</h2>
      <form onSubmit={handleSubmit} className="setting-form beautified-form">
        {/* Şəkil + Ad Soyad yuxarıda */}
        <div className="profile-section">
          <label htmlFor="profileImage" className="image-upload-wrapper">
            <img
              src={formData.imgUrl}
              alt="Profil şəkli"
              className="profile-img"
            />
            <input
              type="file"
              id="profileImage"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageUpload}
            />
          </label>
        </div>

        {/* Aşağıdakı input sahələri */}
        <div className="input-grid">
          <label>
            Ad:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </label>

          <label>
            Soyad:
            <input
              type="text"
              name="surname"
              value={formData.surname}
              onChange={handleChange}
            />
          </label>

          <label>
            Email:
            <input type="email" value={formData.email} disabled />
          </label>

          <label>
            Doğum tarixi:
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate?.split("T")[0]}
              onChange={handleChange}
            />
          </label>
        </div>

        <button type="submit">Yadda saxla</button>
      </form>
    </div>
  );
};

export default Setting;
