import { useEffect, useState } from "react";
import { getApprovedDoctors } from "../../../services/chatService";
import PatientChatWindow from "./PatientChatWindow";
import "./chat.css";

const Messages = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  useEffect(() => {
    getApprovedDoctors().then((res) => setDoctors(res.data));
  }, []);

  return (
    <div className="messages-container">
      <div className="chatDoctor-sidebar">
        <h5>Həkimlər</h5>
        <ul className="doctor-list">
          {doctors.map((doctor) => (
            <li
              key={doctor.id}
              className={`doctor-item ${
                selectedDoctor?.id === doctor.id ? "selected" : ""
              }`}
              onClick={() => setSelectedDoctor(doctor)}
            >
              <img src={doctor.imgUrl || "/default-avatar.png"} alt="avatar" />
              <span className="name-surname">
                {doctor.name} {doctor.surname}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="chat-window">
        {selectedDoctor ? (
          <PatientChatWindow
            receiverId={selectedDoctor.userId}
            receiverName={`${selectedDoctor.name} ${selectedDoctor.surname}`}
            receiverAvatar={selectedDoctor.imgUrl}
          />
        ) : (
          <div style={{ padding: 24, color: "#777" }}>Həkim seçin...</div>
        )}
      </div>
    </div>
  );
};

export default Messages;
