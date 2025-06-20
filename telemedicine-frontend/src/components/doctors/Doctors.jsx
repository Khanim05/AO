import "./doctors.css";
import Slider from "react-slick";
import Doctor from "../doctor/Doctor";
import axios from "axios";
import { useEffect, useState } from "react";
const Doctors = () => {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    axios
      .get(
        "https://khamiyevbabek-001-site1.ktempurl.com/api/DoctorProfile/approved"
      ) // Backend endpoint burada
      .then((res) => setDoctors(res.data))
      .catch((err) => console.error(err));
  }, []);
  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 992, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <section className="doctors-section">
      <h2 className="section-title-doctor">Həkimlərimizlə Tanış Olun</h2>
      <Slider {...settings}>
        {doctors.map((doctor) => {
          console.log("GƏLƏN doctor OBYEKTİ:", doctor); // ✅ burdan userId-nin harda olduğunu görəcəyik

          return (
            <Doctor
              key={doctor.id}
              {...doctor}
              userId={doctor.userId || doctor.user?.id} // fallback varsa
            />
          );
        })}
      </Slider>
    </section>
  );

  // return (
  //     <section className="doctors-section">
  //     <h2 className="section-title">Həkimlərimizlə Tanış Olun</h2>
  //     <Slider {...settings}>
  //       {doctorData.map((doctor) => (
  //         <Doctor key={doctor.id} {...doctor} />
  //       ))}
  //     </Slider>
  //   </section>
  // );
};

export default Doctors;
