import { useFormik } from "formik";
import schema from "../../schema/registerSchemaP";
import registerPhoto from "../../images/registerD.jpg";
import "./registerP.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import axios from 'axios'
import { useNavigate } from "react-router-dom";
const RegisterP = () => {
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      Name: "",
      Surname: "",
      Email: "",
      Password: "",
      ConfirmPassword: "",
      BirthDate: "",
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      try {
        const res = await axios.get(
      `https://khamiyevbabek-001-site1.ktempurl.com/api/Account/check-email?email=${values.Email}`
       );
        if (res.data.exists) {
      toast.error("Bu email ilə artıq qeydiyyatdan keçilib!");
      return;
    }
     
        const formattedValues = {
          ...values,
          BirthDate: values.BirthDate.toISOString(),

        };

        
        localStorage.setItem(
          "registerPatientData",
          JSON.stringify(formattedValues)
        );

        
        navigate("/register/profile-photo");
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message?.includes(
            "Bu istifadəçi artıq mövcüddur."
          )
        ) {
          toast.error("Bu email ilə artıq qeydiyyatdan keçilib!");
        }
        else{
          toast.error("Qeydiyyat zamanı xəta baş verdi.")
        }
        console.error("Xəta:", error.response?.data || error.message);
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
        <ToastContainer/>
        <div className="glass-card">
          <div className="glass-left">
            <img src={registerPhoto} alt="Pasiyent" />
          </div>
          <div className="glass-right">
            <h2>Pasiyent Qeydiyyatı</h2>
            <form onSubmit={formik.handleSubmit} className="glass-form">
              {/* inputlar*/}{" "}
              <div className="input-group">
                <label htmlFor="name">Ad</label>
                <input
                  id="name"
                  type="text"
                  name="Name"
                  placeholder="Adınızı daxil edin."
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
              <div className="input-group">
                <label htmlFor="surname">Soyad</label>
                <input
                  id="surname"
                  type="text"
                  name="Surname"
                  placeholder="Soyadınızı daxil edin."
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
              <div className="input-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  name="Email"
                  placeholder="Emailinizi daxil edin."
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
              <div className="input-group">
                <label htmlFor="date">Doğum tarixi</label>
                <DatePicker
                  selected={formik.values.BirthDate}
                  onChange={(date) => formik.setFieldValue("BirthDate", date)}
                  onBlur={formik.handleBlur}
                  name="BirthDate"
                  placeholderText="Doğum tarixinizi daxil edin."
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
              <div className="input-group">
                <label htmlFor="password">Şifrə</label>
                <input
                  id="password"
                  type="password"
                  name="Password"
                  placeholder="Şifrənizi daxil edin."
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
                <label htmlFor="confirmPassword">Təsdiq Şifrə</label>
                <input
                  id="confirmPassword"
                  type="password"
                  name="ConfirmPassword"
                  placeholder="Təkrar şifrənizi daxil edin."
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
              <button type="submit" className="submit-btn">
                Davam et
              </button>
              <p className="login-redirect">
                Artıq hesabınız var? <a href="/login">Daxil olun</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RegisterP; 