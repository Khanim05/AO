import React, { useState, useRef } from "react";
import "./contact.css";
import {
  FaEnvelope,
  FaPhone,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReCAPTCHA from "react-google-recaptcha";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const captchaTokenRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleCaptcha = (token) => {
  captchaTokenRef.current = token;
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.subject ||
      !formData.message
    ) {
      toast.warn("Zəhmət olmasa bütün sahələri doldurun!");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Email adresi düzgün deyil!");
      return;
    }

   if (!captchaTokenRef.current) {
  toast.error("Zəhmət olmasa robot olmadığınızı təsdiqləyin!");
  return;
}

    try {
      setLoading(true);
      await axios.post(
        "https://khamiyevbabek-001-site1.ktempurl.com/api/Contact",
        formData
      );
      toast.success("Mesaj uğurla göndərildi ✅");
      setFormData({ name: "", email: "", subject: "", message: "" });
      captchaTokenRef.current = null;
    } catch (err) {
      toast.error("Xəta baş verdi, yenidən cəhd edin!");
      console.log(err)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-wrapper">
      

      <div className="contact-info-side">
        <p className="tag">ƏLAQƏ</p>
        <h1 className="title">Bizimlə əlaqə saxlayın</h1>
        <p className="description">
          Sualınız var? Bizə yazın – sizə kömək etməyə hər zaman hazırıq!
        </p>

        <div className="contact-block">
          <FaEnvelope className="icon" />
          <div>
            <p className="label">Email</p>
            <p className="value">contact@telemedicine.az</p>
          </div>
        </div>

        <div className="contact-block">
          <FaPhone className="icon" />
          <div>
            <p className="label">Telefon</p>
            <p className="value">(012) 123-45-67</p>
          </div>
        </div>

        <div className="social">
          <FaFacebookF />
          <FaInstagram />
          <FaLinkedinIn />
        </div>
      </div>

      <div className="contact-form-side">
        <form onSubmit={handleSubmit}>
          <label>Ad</label>
          <input
            type="text"
            name="name"
            placeholder="Adınızı daxil edin"
            value={formData.name}
            onChange={handleChange}
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Email adresinizi daxil edin"
            value={formData.email}
            onChange={handleChange}
          />

          <label>Mövzu</label>
          <input
            type="text"
            name="subject"
            placeholder="Mövzunu daxil edin"
            value={formData.subject}
            onChange={handleChange}
          />

          <label>Mesaj</label>
          <textarea
            name="message"
            placeholder="Mesajınızı yazın..."
            rows="5"
            value={formData.message}
            onChange={handleChange}
          />

          <div style={{ margin: "10px 0" }}>
            <ReCAPTCHA
              sitekey="6Ldbl2krAAAAAHcwjCEOfbcUEgkNHVj-1Ueti76k" // 🔐 Buraya səninki gəldi
              onChange={handleCaptcha}
            />
          </div>

          <button type="submit" className="contactBtn" disabled={loading}>
            {loading ? "Göndərilir..." : "Göndər"}
          </button>
          <ToastContainer /> 
        </form>
      </div>
    </div>
  );
};

export default Contact;
