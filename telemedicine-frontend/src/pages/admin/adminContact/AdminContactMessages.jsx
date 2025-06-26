import React, { useEffect, useState } from "react";
import axios from "axios";
import "./adminMessages.css";

const AdminContactMessages = () => {
  const [messages, setMessages] = useState([]);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("https://khamiyevbabek-001-site1.ktempurl.com/api/Contact", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data);
    } catch (err) {
      console.error("Mesajlar yüklənə bilmədi:", err);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `https://khamiyevbabek-001-site1.ktempurl.com/api/Contact/read/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // ✅ Status yeniləndikdən sonra siyahını təzələ
      fetchMessages();
    } catch (err) {
      console.error("Oxundu olaraq işarələnmədi:", err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="admin-contact-messages">
      <h2>Oxunmamış Əlaqə Mesajları</h2>
      {messages.length === 0 ? (
        <p>Heç bir mesaj yoxdur.</p>
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
              {!msg.isRead && (
                <button
                  className="read-button"
                  onClick={() => handleMarkAsRead(msg.id)}
                >
                  ✅ Oxundu
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminContactMessages;
