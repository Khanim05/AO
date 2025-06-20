import React from "react";
import "./about.css";
import teamImage from "../../images/team.jpg";
const About = () => {
  return (
    <section className="about-section" id="about">
      <div className="about-container">
        <div className="about-text">
          <h2>Haqqımızda</h2>
          <p className="desc">
            Telemedicine platforması olaraq məqsədimiz — həkim və pasiyentləri
            müasir texnologiyalarla bir araya gətirməkdir. Biz sizə evdən
            çıxmadan peşəkar tibbi dəstək alma imkanını təqdim edirik.
            Platformamız vasitəsilə video konsultasiyalar, onlayn reseptlər və
            asan qəbul sistemi ilə sağlamlığınıza vaxtında qayğı göstərə
            bilərsiniz.
          </p>
          <p className="desc">
            Peşəkar həkim heyətimizlə sizə hər zaman dəstək olmağa hazırıq.
          </p>
          <a href="/about" className="about-btn">
            Ətraflı
          </a>
        </div>
        <div className="about-image">
          <img src={teamImage} alt="Həkim komandamız" />
        </div>
      </div>
    </section>
  );
};

export default About;
