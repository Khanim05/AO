import "./doctors.css";
import Slider from "react-slick";
import Doctor from "../doctor/Doctor";
import axios from "axios";
import { useEffect, useState, useRef } from "react";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Hamısı");
  const [sessionCategories, setSessionCategories] = useState(["Hamısı"]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get(
        "https://khamiyevbabek-001-site1.ktempurl.com/api/DoctorCategory/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        const names = res.data.map((cat) => cat.name);
        setSessionCategories(["Hamısı", ...names]);
      })
      .catch((err) => console.error("Seans növü alınmadı:", err));
  }, []);

  useEffect(() => {
    axios
      .get(
        "https://khamiyevbabek-001-site1.ktempurl.com/api/DoctorProfile/approved"
      )
      .then((res) => {
        setDoctors(res.data);
        setFilteredDoctors(res.data);
      })
      .catch((err) => console.error("Həkimlər alınmadı:", err));
  }, []);

  useEffect(() => {
    let filtered = doctors;

    if (selectedCategory !== "Hamısı") {
      filtered = filtered.filter((d) =>
        d.categoryName?.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((d) =>
        `${d.name} ${d.surname}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }

    setFilteredDoctors(filtered);
  }, [searchTerm, selectedCategory, doctors]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    cssEase: "linear",
    responsive: [
      { breakpoint: 992, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <section className="doctors-section">
      <h2 className="section-title-doctor">Həkimlərimizlə Tanış Olun</h2>

      <div className="doctor-filters">
        <input
          type="text"
          placeholder="Həkim axtar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="custom-dropdown" ref={dropdownRef}>
         <button
  className="dropdown-toggle"
  onClick={() => setDropdownOpen(!dropdownOpen)}
>
  {selectedCategory === "Hamısı" && !dropdownOpen
    ? "Seans seçimi"
    : selectedCategory} 
</button>


          <div
            className={`dropdown-menu ${
              dropdownOpen ? "visible-dropdown" : ""
            }`}
          >
            {sessionCategories.map((cat) => (
              <div
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setDropdownOpen(false);
                }}
                className={selectedCategory === cat ? "selected" : ""}
              >
                {cat}
              </div>
            ))}
          </div>
        </div>
      </div>

      <Slider {...settings}>
        {filteredDoctors.map((doctor) => (
          <Doctor
            key={doctor.id}
            {...doctor}
            userId={doctor.userId || doctor.user?.id}
          />
        ))}
      </Slider>
    </section>
  );
};

export default Doctors;
