import React, { useEffect, useState } from "react";
import axios from "axios";
import "./adminMessages.css"; // eyni stili istifadə et

const AdminReadMessages = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchReadMessages = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "https://khamiyevbabek-001-site1.ktempurl.com/api/Contact/read",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMessages(res.data);
      } catch (err) {
        console.error("Oxunmuş mesajlar yüklənə bilmədi:", err);
      }
    };

    fetchReadMessages();
  }, []);

  return (
    <div className="admin-contact-messages">
      <h2>Oxunmuş Əlaqə Mesajları</h2>
      {messages.length === 0 ? (
        <p>Oxunmuş mesaj yoxdur.</p>
      ) : (
        <div className="message-card-list">
          {messages.map((msg) => (
            <div className="message-card" key={msg.id}>
              <p><strong>Ad:</strong> {msg.name}</p>
              <p><strong>Email:</strong> {msg.email}</p>
              <p><strong>Mövzu:</strong> {msg.subject}</p>
              <p><strong>Mesaj:</strong> {msg.message}</p>
              {msg.createAt && (
                <p className="timestamp">
                  <strong>Tarix:</strong> {new Date(msg.createAt).toLocaleString()}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminReadMessages;
