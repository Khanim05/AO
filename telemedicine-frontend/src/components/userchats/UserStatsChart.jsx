import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import axios from "axios";

// Ay adları (Azərbaycan dilində)
const monthNames = [
  "Yan", "Fev", "Mar", "Apr", "May", "İyun",
  "İyul", "Avq", "Sen", "Okt", "Noy", "Dek"
];

const UserStatsChart = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchDoctorStats = async () => {
      try {
        const res = await axios.get(
          "https://khamiyevbabek-001-site1.ktempurl.com/api/DoctorProfile/approved"
        );

        const raw = res.data;

        // Aylar üzrə qruplaşdır
        const countsByMonth = {};

        raw.forEach((doctor) => {
          const createdDate = new Date(doctor.createProfil);
          const monthIndex = createdDate.getMonth(); // 0-11

          if (!countsByMonth[monthIndex]) {
            countsByMonth[monthIndex] = 0;
          }
          countsByMonth[monthIndex]++;
        });

        // Formatı recharts-a uyğun hazırla
        const formatted = monthNames.map((name, index) => ({
          ay: name,
          say: countsByMonth[index] || 0,
        }));

        setChartData(formatted);
      } catch (err) {
        console.error("Həkim statistikası yüklənmədi:", err);
      }
    };

    fetchDoctorStats();
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: 300,
        background: "#fff",
        borderRadius: "12px",
        padding: "16px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <h3 style={{ textAlign: "center", marginBottom: "16px" }}>
        Aylara görə qeydiyyatdan keçən həkim sayı
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="ay" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="say" fill="#8e24aa" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UserStatsChart;
