import React, { useState, useEffect } from "react";
import "./registerDoctor.css";
import StepDoctor from "./StepDoctor";
import Step2Doctor from "./Step2Doctor";
import Step3Doctor from './Step3Doctor'
import { AnimatePresence, motion } from "framer-motion";

const loadFromStorage = (key, defaultValue) => {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : defaultValue;
};

const RegisterD = () => {
const [step, setStep] = useState(() => loadFromStorage("doctorStep", 1));
const [formData, setFormData] = useState(() => {
  const stored = loadFromStorage("doctorForm", {
    Name: "",
    Surname: "",
    Email: "",
    BirthDate: "",
    CategoryId: "",
    LicenseNumber: "",
    Password: "",
    ConfirmPassword: ""
  });
  return { ...stored, ProfileImage: null }; 
});

  useEffect(() => {
  localStorage.setItem("doctorStep", JSON.stringify(step));
  
  const { ProfileImage, ...rest } = formData;
  localStorage.setItem("doctorForm", JSON.stringify(rest));
}, [step, formData]);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const updateFormData = (newData) => {
    setFormData({ ...formData, ...newData });
  };

  const steps = {
    1: (
      <StepDoctor
        nextStep={nextStep}
        setFormData={setFormData}
        formData={formData}
      />
    ),
    2: (
      <Step2Doctor
        nextStep={nextStep}
        prevStep={prevStep}
        updateFormData={updateFormData}
        formData={formData}
      />
    ),
    3: <Step3Doctor 
    setFormData={setFormData}
    prevStep={prevStep}
     formData={formData} />,
  };

  return (
    <div className="step-wrapper">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
        >
          {steps[step]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default RegisterD;
