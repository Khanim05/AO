import { useFormik } from "formik";
import step1Schema from "../../schema/step1D";
import registerPhoto from "../../images/registerD.jpg";
import { motion } from "framer-motion";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const StepDoctor = ({ nextStep, setFormData, formData }) => {
  const formik = useFormik({
    initialValues: {
      Name: formData.Name || "",
      Surname: formData.Surname || "",
      Email: formData.Email || "",
      BirthDate: formData.BirthDate || "",
    },
    validationSchema: step1Schema,
    onSubmit: async (values) => {
      try {
        const res = await axios.get(
          `https://khamiyevbabek-001-site1.ktempurl.com/api/Account/check-email?email=${encodeURIComponent(
            values.Email
          )}`
        );

        if (res.data.exists) {
          toast.error("Bu email ilə artıq qeydiyyatdan keçilib!");
          return;
        }

        setFormData({ ...formData, ...values });
        nextStep();
      } catch (err) {
        toast.error("Email yoxlanarkən xəta baş verdi.");
        console.error("Email yoxlama xətası:", err);
      }
    },
  });

  return (
    <motion.div
      className="register-container-glass"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="register-container-glass">
        <ToastContainer position="top-center" autoClose={3000} />
        <div className="glass-card">
          <div className="glass-left">
            <img src={registerPhoto} alt="Həkim qeydiyyatı" />
          </div>
          <div className="glass-right">
            <h2>Həkim Qeydiyyatı</h2>
            <form onSubmit={formik.handleSubmit} className="glass-form">
              {/* Name */}
              <div className="input-group">
                <label>Ad</label>
                <input
                  type="text"
                  name="Name"
                  placeholder="Adınızı daxil edin"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.Name}
                  className={
                    formik.touched.Name && formik.errors.Name
                      ? "input-error"
                      : ""
                  }
                />
                {formik.touched.Name && formik.errors.Name && (
                  <div className="error">{formik.errors.Name}</div>
                )}
              </div>

              {/* Surname */}
              <div className="input-group">
                <label>Soyad</label>
                <input
                  type="text"
                  name="Surname"
                  placeholder="Soyadınızı daxil edin"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.Surname}
                  className={
                    formik.touched.Surname && formik.errors.Surname
                      ? "input-error"
                      : ""
                  }
                />
                {formik.touched.Surname && formik.errors.Surname && (
                  <div className="error">{formik.errors.Surname}</div>
                )}
              </div>

              {/* Email */}
              <div className="input-group">
                <label>Email</label>
                <input
                  type="email"
                  name="Email"
                  placeholder="Emailinizi daxil edin"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.Email}
                  className={
                    formik.touched.Email && formik.errors.Email
                      ? "input-error"
                      : ""
                  }
                />
                {formik.touched.Email && formik.errors.Email && (
                  <div className="error">{formik.errors.Email}</div>
                )}
              </div>

              {/* BirthDate */}
              <div className="input-group">
                <label>Doğum Tarixi</label>
                <DatePicker
                  selected={formik.values.BirthDate}
                  onChange={(date) =>
                    formik.setFieldValue("BirthDate", date)
                  }
                  onBlur={formik.handleBlur}
                  name="BirthDate"
                  placeholderText="Tarix seçin"
                  className={`fancy-datepicker ${
                    formik.touched.BirthDate && formik.errors.BirthDate
                      ? "error-border"
                      : ""
                  }`}
                  calendarClassName="fancy-calendar"
                  dateFormat="dd/MM/yyyy"
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                />
                {formik.touched.BirthDate && formik.errors.BirthDate && (
                  <div
                    className="error"
                    style={{ marginTop: "15px", marginLeft: "10px" }}
                  >
                    {formik.errors.BirthDate}
                  </div>
                )}
              </div>

              <button type="submit" className="submit-btn">
                Davam et
              </button>
              <p className="login-redirect">
                Artıq hesabınız var? <a href="/login">Daxil olun</a>
              </p>
            </form>
          </div>
        </div>
        <ToastContainer/>
      </div>
    </motion.div>
  );
};

export default StepDoctor;
