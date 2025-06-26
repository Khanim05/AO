import React, { useEffect, useState } from "react";
import {
  FaUser,
  FaStethoscope,
  FaCalendarAlt,
  FaUserTimes,
} from "react-icons/fa";
import axios from "axios";
import "./dashboard.css";
import UserStatsChart from "../../../components/userchats/UserStatsChart";

const Dashboard = () => {
  const [counts, setCounts] = useState({
    patientCount: 0,
    doctorCount: 0,
    unapprovedDoctorCount: 0,
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "https://khamiyevbabek-001-site1.ktempurl.com/api/users/role-counts",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCounts(res.data);
      } catch (err) {
        console.error("Saylar yüklənmədi:", err);
      }
    };

    fetchCounts();
  }, []);

  return (
    <>
      <div className="dashboard-header">
        <h2>Dashboard</h2>

        <div className="avatar top-avatar">
          A <span></span>
        </div>
      </div>
      <div className="stat-area">
      <div className="stats">
        
        <div className="stat blue">
          <FaUser />
          <div>
            <h3>{counts.patientCount}</h3>
            <p>İstifadəçilər</p>
          </div>
        </div>
        <div className="stat green">
          <FaStethoscope />
          <div>
            <h3>{counts.doctorCount}</h3>
            <p>Təsdiqlənmiş Həkimlər</p>
          </div>
        </div>
        <div className="stat orange">
          <FaUserTimes />
          <div>
            <h3>{counts.unapprovedDoctorCount}</h3>
            <p>Təsdiqlənməmiş Həkimlər</p>
          </div>
        </div>
        {/* <div className="stat purple">
          <FaCalendarAlt />
          <div>
            <h3>$5.2000000000000</h3>
            <p>Görüşlər</p>
          </div>
        </div> */}

        
      </div>
      <div className="statsChart">
        <UserStatsChart/>
      </div>
      </div>
    </>
  );
};

export default Dashboard;
