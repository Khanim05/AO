import React from "react";
import "./footer.css";
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn, FaDribbble } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer-modern">
      <div className="footer-container">
        <div className="footer-column">
          <h4>Əlaqə</h4>
          <p>Bakı şəhəri, Nizami küç. 45</p>
          <p>(012) 123-45-67</p>
          <p>contact@telemedicine.az</p>
        </div>

        <div className="footer-column">
          <h4>Marketplace</h4>
          <p>Tez-tez verilən suallar</p>
          <p>Şərtlər və Qaydalar</p>
          <p>Məxfilik</p>
          <p>Sifarişi izləyin</p>
        </div>

        <div className="footer-column">
          <h4>Sürətli keçidlər</h4>
          <p>Haqqımızda</p>
          <p>Əlaqə</p>
          <p>Qəbullar</p>
          <p>Bloq</p>
        </div>

        <div className="footer-column">
          <h4>Yeniliklər</h4>
          <p>Xəbərlərə abunə olun və endirim qazanın</p>
          <div className="newsletter">
            <input type="email" placeholder="Email adresiniz" />
            <button>Abunə ol</button>
          </div>
          <div className="footer-socials">
            <FaFacebookF />
            <FaTwitter />
            <FaDribbble />
            <FaInstagram />
            <FaLinkedinIn />
          </div>
        </div>
      </div>

      <div className="footer-bottom-modern">
        <p>© {new Date().getFullYear()} Telemedicine. Bütün hüquqlar qorunur.</p>
      </div>
    </footer>
  );
};

export default Footer;
