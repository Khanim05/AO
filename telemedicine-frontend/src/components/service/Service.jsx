import {
  VideoCameraIcon,
  DocumentTextIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/solid";

import "./service.css";

const Service = () => {
  return (
    <section className="services-section">
      <h2>Xidmətlərimiz</h2>
      <div className="services-grid">
        <div className="service-card">
          <VideoCameraIcon className="service-icon" />
          <h3 className="service-title">Video Konsultasiya</h3>
          <p className="service-desc">Həkimlərlə canlı video vasitəsilə əlaqə qurun.</p>
        </div>
        <div className="service-card">
          <DocumentTextIcon className="service-icon" />
          <h3 className="service-title">Online Reseptlər</h3>
          <p className="service-desc">Tibbi reseptlərə sürətli çıxış əldə edin.</p>
        </div>
        <div className="service-card">
          <CalendarDaysIcon className="service-icon" />
          <h3 className="service-title">Qəbul Sistemi</h3>
          <p className="service-desc">İstədiyiniz vaxt üçün görüş təyin edin.</p>
        </div>
      </div>
    </section>
  );
};

export default Service;
