import { useFormik } from "formik";
import step2Schema from "../../schema/step2D";
import { motion } from "framer-motion";
import registerPhoto from "../../images/registerD.jpg";
import { useEffect, useState } from "react";
import axios from "axios";

const Step2Doctor = ({ nextStep, prevStep, updateFormData, formData }) => {
  const [categories, setCategories] = useState([]);

 
  useEffect(() => {
    axios
      .get(
        "https://khamiyevbabek-001-site1.ktempurl.com/api/DoctorCategory/all"
      )
      .then((res) => {
        setCategories(res.data);
      })

      .catch((err) => console.error("Kateqoriya xətası:", err));
  }, []);

  const formik = useFormik({
    initialValues: {
      CategoryId: formData.CategoryId || "",
      LicenseNumber: formData.LicenseNumber || "",
      Password: formData.Password || "",
      ConfirmPassword: formData.ConfirmPassword || "",
    },
    validationSchema: step2Schema,
    onSubmit: (values) => {
      updateFormData({ ...formData, ...values });
      nextStep();
    },
  });

  return (
    <motion.div
      className="register-container-glass"
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="glass-card">
        <div className="glass-left">
          <img src={registerPhoto} alt="Həkim qeydiyyatı" />
        </div>
        <div className="glass-right">
          <h2>Həkim Qeydiyyatı (2/3)</h2>
          <form onSubmit={formik.handleSubmit} className="glass-form">
          
            <div className="input-group">
              <label>Kateqoriya</label>
              <select
                name="CategoryId"
                value={formik.values.CategoryId}
                onChange={(e) =>
                  formik.setFieldValue("CategoryId", parseInt(e.target.value))
                }
                onBlur={formik.handleBlur}
                className={
                  formik.touched.CategoryId && formik.errors.CategoryId
                    ? "input-error"
                    : ""
                }
              >
                <option value="">Kateqoriya seçin</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {formik.touched.CategoryId && formik.errors.CategoryId && (
                <div className="error">{formik.errors.CategoryId}</div>
              )}
            </div>

           
            <div className="input-group">
              <label>Təcrübə (il)</label>
              <input
                type="number"
                name="LicenseNumber"
                placeholder="Məsələn: 5"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.LicenseNumber}
                className={
                  formik.touched.LicenseNumber && formik.errors.LicenseNumber
                    ? "input-error"
                    : ""
                }
              />
              {formik.touched.LicenseNumber && formik.errors.LicenseNumber && (
                <div className="error">{formik.errors.LicenseNumber}</div>
              )}
            </div>

            
            <div className="input-group">
              <label>Şifrə</label>
              <input
                type="password"
                name="Password"
                placeholder="Şifrə daxil edin"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.Password}
                className={
                  formik.touched.Password && formik.errors.Password
                    ? "input-error"
                    : ""
                }
              />
              {formik.touched.Password && formik.errors.Password && (
                <div className="error">{formik.errors.Password}</div>
              )}
            </div>

           
            <div className="input-group">
              <label>Təsdiq Şifrə</label>
              <input
                type="password"
                name="ConfirmPassword"
                placeholder="Şifrəni təkrar daxil edin"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.ConfirmPassword}
                className={
                  formik.touched.ConfirmPassword &&
                  formik.errors.ConfirmPassword
                    ? "input-error"
                    : ""
                }
              />
              {formik.touched.ConfirmPassword &&
                formik.errors.ConfirmPassword && (
                  <div className="error">{formik.errors.ConfirmPassword}</div>
                )}
            </div>

            <div className="btn-group">
              <button type="button" onClick={prevStep} className="back-btn">
                Geri
              </button>
              <button type="submit" className="submit-btn">
                Davam et
              </button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default Step2Doctor;
