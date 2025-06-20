import React, { useEffect, useRef, useState } from "react";
import connection from "../../../sockets/chatHub";
import { getMessagesWithUser } from "../../../services/chatService";
import { jwtDecode } from "jwt-decode";
import "./chat.css";

const DoctorChatWindow = ({ receiverId, receiverName, receiverAvatar }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);
  const token = localStorage.getItem("token");

  let currentUserId = null;
  if (token) {
    const decoded = jwtDecode(token);
    currentUserId =
      decoded[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
      ];
  }

  useEffect(() => {
    if (!receiverId) return;

    getMessagesWithUser(receiverId)
      .then((res) => {
        const formatted = res.data.map((m) => ({
          content: m.message,
          createdAt: m.sentAt,
          self: m.senderId === currentUserId,
        }));
        setMessages(formatted);
      })
      .catch((err) => {
        console.error("Mesajlar yüklənərkən xəta baş verdi:", err);
      });
  }, [receiverId]);

  useEffect(() => {
    const connect = async () => {
      try {
        if (connection.state === "Disconnected") {
          await connection.start();
        }

        connection.off("ReceiveMessage");
        connection.on("ReceiveMessage", (msg) => {
          if (msg.senderId === receiverId || msg.receiverId === receiverId) {
            setMessages((prev) => [
              ...prev,
              {
                content: msg.message,
                createdAt: msg.sentAt,
                self: msg.senderId === currentUserId,
              },
            ]);
          }
        });
      } catch (err) {
        console.error("SignalR bağlantı xətası:", err);
      }
    };

    connect();
    return () => {
      connection.off("ReceiveMessage");
    };
  }, [receiverId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || connection.state !== "Connected") return;
    try {
      await connection.invoke("SendMessage", receiverId, input);
      setInput("");
    } catch (err) {
      console.error("SendMessage xətası:", err);
    }
  };

  return (
    <div className="chat-window">
      <div className="chat-header" style={{marginTop:"70px"}}>{receiverName}</div>

      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="empty-message">
            Hələ mesaj yoxdur. Danışmağa başla!
          </div>
        )}

        {messages.map((m, i) => (
          <div className={`chat-message ${m.self ? "self" : ""}`} key={i}>
            {!m.self && (
              <img
                src={receiverAvatar || "/default-avatar.png"}
                alt="avatar"
                className="avatar"
              />
            )}
            <div className="message-bubble">
              <div>{m.content}</div>
              <div className="message-time">
                {new Date(m.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        ))}
        <div ref={chatEndRef}></div>
      </div>

      <div className="chat-input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Pasiyentə mesaj yaz..."
        />
        <button onClick={sendMessage}>Göndər</button>
      </div>
    </div>
  );
};

export default DoctorChatWindow;
