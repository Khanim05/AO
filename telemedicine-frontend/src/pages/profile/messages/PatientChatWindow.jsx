import { useEffect, useRef, useState } from "react";
import { getMessagesWithUser } from "../../../services/chatService";
import { jwtDecode } from "jwt-decode";
import "./chat.css";
import { useDispatch } from "react-redux";
import { setCurrentReceiverId, clearCurrentReceiverId } from "../../../redux/slice/chatSlice";

const PatientChatWindow = ({ receiverId, receiverName, receiverAvatar }) => {
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
        setAutoScroll(true);
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

    const newMessage = {
      content: input,
      createdAt: new Date().toISOString(),
      self: true,
    };

    try {
      const connection = (await import("../../../sockets/chatHub")).default;
      if (connection.state !== "Connected") await connection.start();

      await connection.invoke("SendMessage", receiverId, input);

      setMessages((prev) => [...prev, newMessage]);
      setInput("");
      setAutoScroll(true);
    } catch (err) {
      console.error("SendMessage xətası:", err);
    }
  };

  useEffect(() => {
    if (receiverId) {
      dispatch(setCurrentReceiverId(receiverId));
    }
    return () => {
      dispatch(clearCurrentReceiverId());
    };
  }, [receiverId]);

  useEffect(() => {
  const handleNewMessage = (e) => {
    console.log("📩 Mesaj UI pəncərəsinə çatdı:", e.detail);
    setMessages((prev) => [...prev, e.detail]);
    setAutoScroll(true);
  };

  window.addEventListener("newMessageReceived", handleNewMessage);
  return () => {
    window.removeEventListener("newMessageReceived", handleNewMessage);
  };
}, []);


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
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Həkimə mesaj yaz..."
        />
        <button onClick={sendMessage}>Göndər</button>
      </div>
    </div>
  );
};

export default PatientChatWindow;
