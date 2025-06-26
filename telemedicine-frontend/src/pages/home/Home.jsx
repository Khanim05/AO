import Main from "../../components/main/Main";
import Service from "../../components/service/Service";
import About from "../../components/about/About";
import Doctors from "../../components/doctors/Doctors";
import Contact from "../../components/contact/Contact";
import Footer from "../../components/footer/Footer";
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const Home = () => {
  const contactRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    if (location.hash === "#contact") {
      setTimeout(() => {
        contactRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100); // Kiçik delay lazım olur, yoxsa ref hazır olmur
    }
  }, [location]);

  return (
    <div className="home-page">
      <Main />
      <Service />
      <About />
      <Doctors />
      <div ref={contactRef} id="contact">
        <Contact />
      </div>
      <Footer />
    </div>
  );
};

export default Home;
