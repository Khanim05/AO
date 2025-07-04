import React, { useEffect, useRef, useState } from "react";
import { getMessagesWithUser } from "../../../services/chatService";
import { jwtDecode } from "jwt-decode";
import "./chat.css";
import connection from "../../../sockets/chatHub";
import { useDispatch } from "react-redux";
import { setCurrentReceiverId,clearCurrentReceiverId } from "../../../redux/slice/chatSlice";

const DoctorChatWindow = ({ receiverId, receiverName, receiverAvatar }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [autoScroll, setAutoScroll] = useState(false);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);
  const dispatch = useDispatch();

  const token = localStorage.getItem("token");
  let currentUserId = null;
  if (token) {
    const decoded = jwtDecode(token);
    currentUserId = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
  }

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

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
        setAutoScroll(false);
      })
      .catch((err) => {
        console.error("Mesajlar yüklənərkən xəta baş verdi:", err);
      });
  }, [receiverId]);

  useEffect(() => {
    if (autoScroll) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      setAutoScroll(false);
    }
  }, [messages, autoScroll]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    try {
      const connection = (await import("../../../sockets/chatHub")).default;
      if (connection.state !== "Connected") await connection.start();

      await connection.invoke("SendMessage", receiverId, input);
      setInput("");
    } catch (err) {
      console.error("SendMessage xətası:", err);
    }
  };
useEffect(() => {
  const setupSignalR = async () => {
    if (connection.state === "Disconnected") {
      await connection.start();
    }

    connection.off("ReceiveMessage"); // təmizləyirik
    connection.on("ReceiveMessage", (msg) => {
      setMessages((prev) => [
        ...prev,
        {
          content: msg.message,
          createdAt: msg.sentAt,
          self: msg.senderId === currentUserId,
        },
      ]);
      setAutoScroll(true);
    });
  };

  setupSignalR();
  return () => {
    connection.off("ReceiveMessage");
  };
}, [receiverId]);

useEffect(() => {
  if (receiverId) {
    dispatch(setCurrentReceiverId(receiverId));
  }

  return () => {
    dispatch(clearCurrentReceiverId());
  };
}, [receiverId]);


  return (
    <div className="chat-window">
      <div className="chat-header" style={{ marginTop: "70px", marginLeft: "20px" }}>
        {receiverName}
      </div>

      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="empty-message">Hələ mesaj yoxdur. Danışmağa başla!</div>
        )}

        {messages.map((m, i) => (
          <div className={`chat-message ${m.self ? "self" : ""}`} key={i}>
            {!m.self && (
              <img src={receiverAvatar || "/default-avatar.png"} alt="avatar" className="avatar" />
            )}
            <div className="message-bubble">
              <div>{m.content}</div>
              <div className="message-time">
                {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>
          </div>
        ))}
        <div ref={chatEndRef}></div>
      </div>

      <div className="chat-input-area">
        <input
          ref={inputRef}
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
