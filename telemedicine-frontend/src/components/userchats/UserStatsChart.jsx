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

const data = [
  { ay: "Yan", say: 10 },
  { ay: "Fev", say: 18 },
  { ay: "Mar", say: 25 },
  { ay: "Apr", say: 32 },
  { ay: "May", say: 45 },
  { ay: "İyun", say: 50 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="custom-tooltip"
        style={{
          background: "var(--card-bg, #ffffff)",
          border: "1px solid #ccc",
          padding: "8px",
          borderRadius: "6px",
          color: "var(--text-main, #000000)",
        }}
      >
        <p><strong>{label}</strong></p>
        <p>İstifadəçi sayı: {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

const UserStatsChart = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDark = () => {
      setIsDark(document.body.classList.contains("dark"));
    };

    checkDark();

    // Listener varsa əlavə et (opsional)
    const observer = new MutationObserver(checkDark);
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: 300,
        backgroundColor: isDark ? "#1e1e1e" : "#fff",
        padding: "16px",
        borderRadius: "12px",
        boxShadow: isDark
          ? "0 2px 8px rgba(255, 255, 255, 0.05)"
          : "0 2px 8px rgba(0, 0, 0, 0.05)",
      }}
    >
      <h3
        style={{
          textAlign: "center",
          marginBottom: "16px",
          color: isDark ? "#f1f1f1" : "#111",
        }}
      >
        Aylara görə istifadəçi sayı
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={isDark ? "#444" : "#ccc"}
          />
          <XAxis
            dataKey="ay"
            stroke={isDark ? "#ccc" : "#333"}
            tick={{ fill: isDark ? "#ccc" : "#333" }}
          />
          <YAxis
            stroke={isDark ? "#ccc" : "#333"}
            tick={{ fill: isDark ? "#ccc" : "#333" }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="say" fill="#0f62fe" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UserStatsChart;
