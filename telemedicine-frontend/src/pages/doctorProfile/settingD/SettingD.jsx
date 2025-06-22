import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";
import "../../profile/setting/setting.css";

const SettingD = () => {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    birthDate: "",
    imgUrl: "",
    email: "",
    categoryId: "",
  });
  const [loading, setLoading] = useState(true);
  const [doctorId, setDoctorId] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const decoded = jwtDecode(token);
        const userId =
          decoded[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
          ];

        const catRes = await axios.get(
          "https://khamiyevbabek-001-site1.ktempurl.com/api/DoctorCategory/all"
        );
        setCategories(catRes.data);

        const approvedRes = await axios.get(
          "https://khamiyevbabek-001-site1.ktempurl.com/api/DoctorProfile/approved",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const currentDoctor = approvedRes.data.find(
          (doc) => doc.userId === userId
        );

        if (!currentDoctor) {
          toast.error("Həkim profili tapılmadı.");
          return;
        }

        setDoctorId(currentDoctor.id);

        const profileRes = await axios.get(
          `https://khamiyevbabek-001-site1.ktempurl.com/api/DoctorProfile/${currentDoctor.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setFormData(profileRes.data);
      } catch (err) {
        toast.error("Profil məlumatları yüklənə bilmədi.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorProfile();
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
    formDataCloud.append("upload_preset", "your_upload_preset");
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

      toast.success("Şəkil uğurla yükləndi ✅");
    } catch (err) {
      toast.error("Yükləmə zamanı xəta baş verdi ❌");
      console.error("Upload error:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!doctorId) return toast.error("Həkim ID tapılmadı");

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `https://khamiyevbabek-001-site1.ktempurl.com/api/DoctorProfile/${doctorId}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Profil məlumatları uğurla yeniləndi.");
    } catch (err) {
      toast.error("Yeniləmə zamanı xəta baş verdi.");
      console.error(err);
    }
  };

  if (loading) return <p>Yüklənir...</p>;

  return (
    <div className="setting-container">
      <ToastContainer />
      <h2>Profil Məlumatları (Həkim)</h2>
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
            Seans növü:
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
            >
              <option value="">Seçin</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Doğum tarixi:
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate?.split("T")[0] || ""}
              onChange={handleChange}
            />
          </label>
        </div>

        <button type="submit">Yadda saxla</button>
      </form>
    </div>
  );
};

export default SettingD;
