import React from "react";
import PatientChatWindow from "../../pages/profile/messages/PatientChatWindow";
import "./chatModal.css";
const ChatModal = ({ doctor, onClose }) => {
  if (!doctor) return null;
  return (
    <div className="chat-modal-overlay">
      <div className="chat-modal">
        <button className="close-btn" onClick={onClose}>
          ✖
        </button>
        <PatientChatWindow
          receiverId={doctor.userId}
          receiverName={`${doctor.name} ${doctor.surname}`}
          receiverAvatar={doctor.imgUrl}
        />
      </div>
    </div>
  );
};

export default ChatModal;
