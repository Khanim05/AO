import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./resetPassword.css";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const email = searchParams.get("email");
  const token = searchParams.get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast.error("Zəhmət olmasa bütün sahələri doldurun.");
      return;
    }

    try {
      const response = await axios.post(
        "https://khamiyevbabek-001-site1.ktempurl.com/api/users/reset-password",
        {
          email,
          token,
          newPassword,
          confirmPassword,
        }
      );

      toast.success(response.data); // Backend string qaytarır
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data || "Şifrəni dəyişmək zamanı xəta baş verdi."
      );
    }
  };

  return (
    <div className="reset-container">
      <ToastContainer autoClose={3000} />
      <div className="reset-card">
        <h2>Yeni Şifrə Təyin Et</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Yeni şifrə"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Şifrənin təkrarı"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button type="submit">Şifrəni Yenilə</button>
        </form>
        <a className="back-login" href="/login">← Girişə qayıt</a>
      </div>
    </div>
  );
};

export default ResetPassword;

