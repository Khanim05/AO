import { useEffect, useState } from "react";
import DoctorChatWindow from "./DoctorChatWindow";
import axios from "axios";
import "./chat.css";

const MessagesD = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/Chat/patients", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // 🔥 Burada təkrar userId-ləri filter et
        const uniquePatients = Array.from(
          new Map(res.data.map((p) => [p.id, p])).values()
        );

        console.log("🧼 Təmiz pasiyentlər:", uniquePatients);
        setPatients(uniquePatients);
      } catch (err) {
        console.error("Pasiyentləri yükləmək mümkün olmadı:", err);
      }
    };

    fetchPatients();
  }, []);

  return (
    <div className="messages-container">
      <div className="doctor-sidebar">
        <h3>Pasiyentlər</h3>
        <ul className="doctor-list">
          {patients.map((patient) => (
            <li
              key={patient.id || patient.userId}
              className={`doctor-item ${
                selectedPatient?.userId === patient.userId ? "selected" : ""
              }`}
              onClick={() => setSelectedPatient(patient)}
            >
              <img src={patient.imgUrl || "/default-avatar.png"} alt="avatar" />
              <span className="name-surname">
                {patient.name} {patient.surname}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="chat-window">
        {selectedPatient ? (
          <DoctorChatWindow
            receiverId={selectedPatient.id}
            receiverName={`${selectedPatient.name} ${selectedPatient.surname}`}
            receiverAvatar={selectedPatient.imgUrl}
          />
        ) : (
          <div style={{ padding: 24, color: "#777" }}>Pasiyent seçin...</div>
        )}
      </div>
    </div>
  );
};

export default MessagesD;
