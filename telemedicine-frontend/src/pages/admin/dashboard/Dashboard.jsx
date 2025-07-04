import React, { useEffect, useState } from "react";
import {
  FaUser,
  FaStethoscope,
  FaUserTimes,
  FaMoneyBillWave,
} from "react-icons/fa";
import axios from "axios";
import "./dashboard.css";
import UserStatsChart from "../../../components/userchats/UserStatsChart";
import { toast, ToastContainer } from "react-toastify";

const Dashboard = () => {
  const [counts, setCounts] = useState({
    patientCount: 0,
    doctorCount: 0,
    unapprovedDoctorCount: 0,
  });
  const [price, setPrice] = useState(0);
  const [newPrice, setNewPrice] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await axios.get(
          "https://khamiyevbabek-001-site1.ktempurl.com/api/users/role-counts",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCounts(res.data);
      } catch (err) {
        console.error("Saylar yüklənmədi:", err);
      }
    };

    const fetchPrice = async () => {
      try {
        const res = await axios.get(
          "https://khamiyevbabek-001-site1.ktempurl.com/api/Settings/price",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setPrice(res.data);
      } catch (err) {
        console.error("Qiymət yüklənmədi:", err);
      }
    };

    fetchCounts();
    fetchPrice();
  }, [token]);

  const handlePriceChange = async () => {
    try {
      await axios.put(
        "https://khamiyevbabek-001-site1.ktempurl.com/api/Settings/price",
        parseFloat(newPrice),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setPrice(parseFloat(newPrice));
      toast.success("Qiymət uğurla yeniləndi!");
      setNewPrice("");
    } catch (err) {
      toast.error("Qiymət yenilənərkən xəta baş verdi!");
      console.error(err);
    }
  };

  return (
    <>
      <div className="dashboard-header">
        <h2>İdarə Paneli</h2>
        <div className="avatar top-avatar">A</div>
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

          <div className="stat purple">
            <FaMoneyBillWave />
            <div>
              <h3>{price} ₼</h3>
              <p>Seans Qiyməti</p>
              <div className="price-input-wrapper">
                <input
                  type="number"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  placeholder="Yeni qiymət"
                />
                <button onClick={handlePriceChange}>Yenilə</button>
              </div>
            </div>
          </div>
        </div>

        <div className="statsChart">
          <UserStatsChart />
        </div>

      </div>
      <ToastContainer/>
    </>
  );
};

export default Dashboard;
