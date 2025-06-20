import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./forgotPassword.css"; // ayrıca stil faylı (aşağıda var)

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Zəhmət olmasa emailinizi daxil edin.");
      return;
    }

    try {
      const response = await axios.post(
        "https://khamiyevbabek-001-site1.ktempurl.com/api/users/forgot-password",
        { email }
      );

      toast.success(response.data.message || "Sıfırlama bağlantısı göndərildi!");
    } catch (error) {
      toast.error("Sıfırlama bağlantısı göndərilə bilmədi.");
      console.error(error);
    }
  };

  return (
    <div className="forgot-container">
      <ToastContainer autoClose={3000} />
      <div className="forgot-card">
        <h2>Şifrəni sıfırla</h2>
        <p>Zəhmət olmasa qeydiyyatda olduğunuz emaili daxil edin:</p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit">Göndər</button>
        </form>
        <a className="back-login" href="/login">← Girişə qayıt</a>
      </div>
    </div>
  );
};

export default ForgotPassword;

