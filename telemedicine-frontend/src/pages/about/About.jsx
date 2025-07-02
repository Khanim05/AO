import React from "react";
import "./about.css";
import psychologyImg from "../../images/psixolog.jpg";
import {
  FaBullseye,     
  FaUsers,        
  FaCheckCircle,  
  FaRibbon        
} from "react-icons/fa";
import Footer from "../../components/footer/Footer";

const About = () => {
  return (
    <div className="div-area">
      <div className="info-wrapper">
      <div className="info-grid">
        <div className="info-content">
          <h1>Haqqımızda</h1>

          <section>
            <h2><FaBullseye /> Layihənin Məqsədi</h2>
            <p>
              Platformamız psixoloji dəstəyə ehtiyac duyan insanlarla peşəkar psixoloqları bir araya gətirmək üçün qurulub.
              Məqsədimiz — rahat, təhlükəsiz və əlçatan psixoloji xidmət təqdim etməkdir.
            </p>
          </section>

          <section>
            <h2><FaUsers /> Biz Kimik?</h2>
            <p>
              Biz texnologiya və psixologiya sahəsində ixtisaslaşmış bir komandayıq. Hər kəsin psixoloji dəstəyə
              istədiyi anda çıxışını təmin etmək üçün bu platformanı yaratmışıq.
            </p>
          </section>

          <section>
            <h2><FaCheckCircle /> Niyə Bizi Seçməlisiniz?</h2>
            <ul>
              <li>Peşəkar və təsdiqlənmiş psixoloqlar</li>
              <li>Rahat vaxt seçimi ilə seans sifarişi</li>
              <li>Görüntülü video seans imkanı</li>
              <li>Məlumatların məxfiliyi və təhlükəsizliyi</li>
              <li>Real vaxtda yazışma funksiyası</li>
            </ul>
          </section>

          <section>
            <h2><FaRibbon /> Missiyamız</h2>
            <p>
              Biz inanırıq ki, psixoloji dəstək hər kəsin hüququdur, lüks deyil. Məqsədimiz — insanların ruh sağlamlığını
              gücləndirmək üçün onlara vaxtında, rahat və təhlükəsiz şəkildə peşəkar dəstək təqdim etməkdir.
            </p>
          </section>
        </div>

        <div className="info-image">
          <img src={psychologyImg} alt="Online Psixoloq Seansı" />
        </div>
      </div>
     
    </div> 
    <Footer/>
    </div>
    
  );
};

export default About;
