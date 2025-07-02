import "./App.css";
import { Navigate, useRoutes } from "react-router";
import Layout from "./components/layout/Layout";
import Home from "./pages/home/Home";
import About from "./pages/about/About";
import Doctor from "./pages/doctor/Doctor";
import Profile from "./pages/profile/Profile";
import PrivateRoute from "./routes/PrivateRoute";
import Register from "./pages/register/Register";
import { AnimatePresence } from "framer-motion";
import RegisterD from "./pages/regDoctor/RegisterD";
import RegisterP from "./pages/regPatient/RegisterP";
import RegisterPhoto from "./pages/regPhoto/RegisterPhoto";
import Login from "./pages/login/Login";
import Admin from "./pages/admin/Admin";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { loginSuccess } from "./redux/slice/authSlice";
import NotF from "./pages/notF/NotF";
import DoctorProfile from "./pages/doctorProfile/DoctorProfile";
import AcceptDoctor from "./pages/admin/acceptDoctor/AcceptDoctor";
import Appointment from "./pages/admin/appointment/Appointment";
import PendingDoctor from "./pages/admin/pendingDoctor/PendingDoctor";
import Users from "./pages/admin/user/Users";
import Dashboard from "./pages/admin/dashboard/Dashboard";
import DoctorSeans from "./pages/admin/doctorSeans/DoctorSeans";
import Myprofile from "./pages/profile/myProfile/Myprofile";
import AppointP from "./pages/profile/appointP/AppointP";
import Messages from "./pages/profile/messages/Messages";
import Setting from "./pages/profile/setting/Setting";
import MyProfileD from "./pages/doctorProfile/myProfile/MyProfileD";
import AppointD from "./pages/doctorProfile/appointD/AppointD";
import MessagesD from "./pages/doctorProfile/messageD/MessagesD";
import SettingD from "./pages/doctorProfile/settingD/SettingD";
import ForgotPassword from "./pages/forgotPassword/ForgotPassword";
import ResetPassword from "./pages/resetPassword/ResetPassword";
import AdminContactMessages from "./pages/admin/adminContact/AdminContactMessages";
import AdminReadMessages from "./pages/admin/adminRead/AdminReadMessages";
import VideoCallPage from "./pages/videoCall/VideoCallPage";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    let user = null;
    try {
      const userStr = localStorage.getItem("user");
      if (userStr && userStr !== "undefined") {
        user = JSON.parse(userStr);
      }
    } catch (err) {
      console.error("JSON parse xətası (App.jsx):", err);
    }

    const token = localStorage.getItem("token");

    if (token && user) {
      dispatch(loginSuccess({ token, user }));
    }
  }, [dispatch]);

  const router = useRoutes([
    {
      path: "/",
      element: <Layout />,
      children: [
        { path: "", element: <Home /> },
        { path: "about", element: <About /> },
        { path: "doctors", element: <Doctor /> },
        {
          path: "profile",
          element: (
            <PrivateRoute role={["Patient"]}>
              <Profile />
            </PrivateRoute>
          ),

          children: [
            { index: true, element: <Navigate to="appointmentP" /> }, // default yönləndirmə
            { path: "myProfile", element: <Myprofile /> },
            { path: "appointmentP", element: <AppointP /> },
            { path: "messagesP", element: <Messages /> },
            { path: "settingP", element: <Setting /> },
          ],
        },
        {
          path: "doctor",
          element: (
            <PrivateRoute role={["Doctor"]}>
              <DoctorProfile />
            </PrivateRoute>
          ),
          children: [
            { index: true, element: <Navigate to="appointmentD" /> }, // default yönləndirmə
            { path: "appointmentD", element: <AppointD /> }, // boş olsa da işləyir
            { path: "myProfileDoctor", element: <MyProfileD /> },
            { path: "messagesD", element: <MessagesD /> },
            { path: "settingD", element: <SettingD /> },
          ],
        },
        {path:"video-call/:roomId", element:<VideoCallPage/>}
      ],
    },
    {
      path: "register",
      children: [
        { index: true, element: <Register /> },
        { path: "doctor", element: <RegisterD /> },
        { path: "patient", element: <RegisterP /> },
        { path: "profile-photo", element: <RegisterPhoto /> },
      ],
    },
    { path: "login", element: <Login /> },
    { path: "forgot-password", element: <ForgotPassword /> },
    { path: "reset-password", element: <ResetPassword /> },
    {
      path: "admin",
      element: (
        <PrivateRoute role={["Admin"]}>
          <Admin />
        </PrivateRoute>
      ),
      children: [
        { index: true, element: <Navigate to="dashboard" /> },
        { path: "dashboard", element: <Dashboard /> }, 
        { path: "users", element: <Users /> },
        { path: "accept-doctor", element: <AcceptDoctor /> },
        { path: "pending-doctor", element: <PendingDoctor /> },
        { path: "appointment", element: <Appointment /> },
        { path: "doctor-seans", element: <DoctorSeans /> },
        {path:"contact-messages", element:<AdminContactMessages/>},
        {path:"read-messages",element:<AdminReadMessages/>}
      ],
    },
    { path: "*", element: <NotF /> },
  ]);
  return (
    <AnimatePresence mode="wait">
      <div key={location.pathname}>{router}</div>
    </AnimatePresence>
  );
}

export default App;

