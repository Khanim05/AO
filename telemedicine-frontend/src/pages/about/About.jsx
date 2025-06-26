import React from "react";
import "./about.css";
import psychologyImg from "../../images/psixolog.jpg"; // şəkil yolunu uyğunlaşdır

const About = () => {
  return (
    <div className="about-container">
      <div className="about-grid">
        <div className="about-text">
          <h1>Haqqımızda</h1>

          <section>
            <h2>🎯 Layihənin Məqsədi</h2>
            <p>
              Platformamız psixoloji dəstəyə ehtiyac duyan insanlarla peşəkar psixoloqları bir araya gətirmək üçün qurulub.
              Məqsədimiz — rahat, təhlükəsiz və əlçatan psixoloji xidmət təqdim etməkdir.
            </p>
          </section>

          <section>
            <h2>👥 Biz Kimik?</h2>
            <p>
              Biz texnologiya və psixologiya sahəsində ixtisaslaşmış bir komandayıq. Hər kəsin psixoloji dəstəyə
              istədiyi anda çıxışını təmin etmək üçün bu platformanı yaratmışıq.
            </p>
          </section>

          <section>
            <h2>💡 Niyə Bizi Seçməlisiniz?</h2>
            <ul>
              <li>✅ Peşəkar və təsdiqlənmiş psixoloqlar</li>
              <li>📅 Rahat vaxt seçimi ilə seans sifarişi</li>
              <li>🎥 Görüntülü video seans imkanı</li>
              <li>🔐 Məlumatların məxfiliyi və təhlükəsizliyi</li>
              <li>💬 Real vaxtda yazışma funksiyası</li>
            </ul>
          </section>

          <section>
            <h2>🎗️ Missiyamız</h2>
            <p>
              Biz inanırıq ki, psixoloji dəstək hər kəsin hüququdur, lüks deyil. Məqsədimiz — insanların ruh sağlamlığını
              gücləndirmək üçün onlara vaxtında, rahat və təhlükəsiz şəkildə peşəkar dəstək təqdim etməkdir. Bu platforma
              vasitəsilə biz cəmiyyətin hər təbəqəsinə psixoloji xidmətləri əlçatan etməyə çalışırıq.
            </p>
          </section>
        </div>

        <div className="about-image">
          <img src={psychologyImg} alt="Online Psixoloq Seansı" />
        </div>
      </div>
    </div>
  );
};

export default About;
