import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { setNotification } from "../../redux/slice/notificationSlice";
import { toast } from "react-toastify";
import connection from "../../sockets/chatHub";

const GlobalMessageListener = () => {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");

  const currentChatUserId = useSelector(
    (state) => state.chat.currentReceiverId
  );

  useEffect(() => {
    const currentUserId = token
      ? jwtDecode(token)[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ]
      : null;

    const setupSignalR = async () => {
      if (!token || !currentUserId) return;

      try {
        if (connection.state === "Disconnected") {
          await connection.start();
        }

        connection.off("ReceiveMessage");
        connection.on("ReceiveMessage", (msg) => {
  const isOwn = msg.senderId === currentUserId;

  // 🔥 Əgər artıq əlavə olunubsa və ya öz mesajımızdırsa → çıx
  if (isOwn) return;

  // Əgər aktiv chatda deyilsə → notifikasiya
  if (msg.senderId !== currentChatUserId) {
    dispatch(setNotification());
    toast.info("Yeni mesajınız var 💬", {
      position: "top-right",
      autoClose: 4000,
    });
    new Audio("/notif.mp3").play().catch(() => {});
  }

  // ✅ Əgər aktiv chatdırsa → pəncərəyə mesaj ötür
  if (msg.senderId === currentChatUserId) {
    const newMsg = {
      content: msg.message,
      createdAt: msg.sentAt,
      self: false,
    };

    console.log("📩 UI-yə ötürülür:", newMsg);
    window.dispatchEvent(
      new CustomEvent("newMessageReceived", { detail: newMsg })
    );
  }
});
      } catch (err) {
        console.error("🔌 SignalR bağlantı xətası:", err);
      }
    };

    setupSignalR();

    return () => {
      connection.off("ReceiveMessage");
    };
  }, [token, dispatch, currentChatUserId]);

  return null;
};

export default GlobalMessageListener;
