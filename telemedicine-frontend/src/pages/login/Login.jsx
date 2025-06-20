import "./login.css";
import loginPhoto from "../../images/registerD.jpg";
import { motion } from "framer-motion";
import { useFormik } from "formik";
import Loginschema from "../../schema/loginSchema";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../redux/slice/authSlice";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      Email: "",
      Password: "",
    },
    validationSchema: Loginschema,
    onSubmit: async (values) => {
      try {
        const response = await axios.post(
          "https://khamiyevbabek-001-site1.ktempurl.com/api/Account/login",
          values
        );

        const { success, message, token, role } = response.data; // Backend sadəcə token string qaytarır

        if (success) {
          dispatch(
            loginSuccess({
              token,
              user: {
                email: values.Email,
                role: role,
              },
            })
          );

          toast.success(message || "Daxil oldunuz!");
          console.log(response.data);

          setTimeout(() => {
            if (role === "Admin") {
              navigate("/admin/dashboard");
            } else if(role=="Doctor"){
              navigate("/doctor/appointmentD")
            }
            else if (role=="Patient") {
              navigate("/")
            }
          }, 1500);
        } else {
          toast.error(message || "Daxil olmaq mümkün olmadı");
        }
      } catch (error) {
        console.error("Login xətası:", error);
        toast.error("Daxil olmaq mümkün olmadı");
      }
    },
  });

  return (
    <motion.div
      className="login-container"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="login-card">
        <ToastContainer autoClose={3000} />
        <div className="login-left">
          <img src={loginPhoto} alt="Login visual" />
        </div>
        <div className="login-right">
          <h2>Daxil Ol</h2>
          <form onSubmit={formik.handleSubmit}>
            <div className="input-group">
              <label>Email</label>
              <input
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
              <label>Şifrə</label>
              <input
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
              <p className="forgot-password">
                <a href="/forgot-password">Şifrənizi unutmusunuz?</a>
              </p>
            </div>

            <button type="submit" className="login-btn">
              Daxil Ol
            </button>

            <p className="register-link">
              Hesabınız yoxdur? <a href="/register">Qeydiyyatdan keçin</a>
            </p>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default Login;
