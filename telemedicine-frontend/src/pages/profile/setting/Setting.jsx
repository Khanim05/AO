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
    email: "",
    imgUrl: "", // Preview üçün
    profileImageFile: null, // Backend üçün fayl
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
        setFormData((prev) => ({
          ...prev,
          name: res.data.name,
          surname: res.data.surname,
          birthDate: res.data.birthDate,
          email: res.data.email,
          imgUrl: res.data.imgUrl,
        }));
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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      imgUrl: URL.createObjectURL(file), // preview
      profileImageFile: file, // backend üçün göndəriləcək fayl
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("token");
  const form = new FormData();

  form.append("Name", formData.name);
  form.append("Surname", formData.surname);
  form.append("BirthDate", formData.birthDate); // format: YYYY-MM-DD

  if (formData.profileImageFile) {
    form.append("ProfileImage", formData.profileImageFile);
  }

   for (let [key, value] of form.entries()) {
    console.log(`${key}:`, value);
  }

  try {
    const res = await axios.put(
      "https://khamiyevbabek-001-site1.ktempurl.com/api/users/profile",
      form,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    toast.success("Profil məlumatları uğurla yeniləndi.");
  } 
   catch (err) {
  if (err.response?.status === 204 || err.response?.status === 200) {
    toast.success("Profil məlumatları uğurla yeniləndi.");
  } else if (err.response?.data?.message) {
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
