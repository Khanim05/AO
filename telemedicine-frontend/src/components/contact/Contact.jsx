import React, { useState } from "react";
import "./contact.css";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.warn("Bütün sahələri doldurun!", { autoClose: 3000 });
      return;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Etibarlı email daxil edin!", { autoClose: 3000 });
      return;
    }

    try {
      setLoading(true);
      await axios.post("https://khamiyevbabek-001-site1.ktempurl.com/api/Contact", formData);
      toast.success("Mesaj uğurla göndərildi ✅", { autoClose: 3000 });
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      toast.error("Xəta baş verdi, yenidən cəhd edin!", { autoClose: 4000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-wrapper">
      <ToastContainer />
      <div className="contact-form-side">
        <form onSubmit={handleSubmit}>
          <label>Ad Soyad</label>
          <input
            type="text"
            name="name"
            placeholder="Adınızı daxil edin"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Email adresinizi daxil edin"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label>Mövzu</label>
          <input
            type="text"
            name="subject"
            placeholder="Mövzunu daxil edin"
            value={formData.subject}
            onChange={handleChange}
            required
          />

          <label>Mesaj</label>
          <textarea
            name="message"
            placeholder="Mesajınızı yazın..."
            rows="5"
            value={formData.message}
            onChange={handleChange}
            required
          />

          <button className="contactBtn" type="submit" disabled={loading}>
            {loading ? "Göndərilir..." : "Göndər"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
