import "./main.css";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import videcall from "../../images/videcall.jpg";
import resept from "../../images/resept.jpg";
import calendar from "../../images/calendar.jpg";

const slides = [
  {
    id: 1,
    image: videcall,
    title: "Video Konsultasiya",
    description: "Həkiminizlə canlı video əlaqə qurun.",
    buttonText: "Zəng Et",
  },
  {
    id: 2,
    image: resept,
    title: "Online Reseptlər",
    description: "Ən yeni tibbi reseptlərə asan çıxış.",
    buttonText: "Ətraflı",
  },
  {
    id: 3,
    image: calendar,
    title: "Qəbul Sistemi",
    description: "İstədiyiniz vaxt üçün onlayn qəbul alın.",
    buttonText: "Qəbul Al",
  },
];

const Main = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="slider-container">
      <AnimatePresence mode="wait">
        <motion.div
          key={slides[index].id}
          className="slider"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.8 }}
        >
          <img src={slides[index].image} alt="slider" className="slider-img" />
          <div className="slider-content">
            <motion.h2
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              {slides[index].title}
            </motion.h2>
            <motion.p
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              {slides[index].description}
            </motion.p>
            <motion.button
              className="slider-btn"
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.95 }}
            >
              {slides[index].buttonText}
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Main;
