import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Peer from "simple-peer";
import { createVideoSignalConnection } from "../../sockets/videoSignal";

const VideoCall = () => {
  const { roomId } = useParams();
  const [stream, setStream] = useState(null);
  const peerRef = useRef({});
  const userVideo = useRef();
  const partnerVideo = useRef();
  const connectionRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const connection = createVideoSignalConnection(token);
    connectionRef.current = connection;

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        userVideo.current.srcObject = currentStream;

        connection
          .start()
          .then(() => {
            console.log("🟢 SignalR bağlantısı uğurla başladı");
            connection.invoke("JoinRoom", roomId);
          })
          .catch((err) => console.error("❌ SignalR bağlantı xətası:", err));

        connection.on("AllUsers", (users) => {
          console.log("💡 AllUsers gəldi:", users);
          users.forEach((connId) => {
            const peer = createPeer(connId, currentStream);
            peerRef.current[connId] = peer;
          });
        });

        connection.on("UserJoined", (connId) => {
          console.log("➕ Yeni qoşulan:", connId);
          setTimeout(() => {
            const peer = createPeer(connId, currentStream);
            peerRef.current[connId] = peer;
          }, 1000); // gecikmə ilə
        });

        connection.on("ReceiveOffer", (fromId, sdp) => {
          console.log("📡 Offer gəldi:", fromId);
          const peer = addPeer(JSON.parse(sdp), fromId, currentStream);
          peerRef.current[fromId] = peer;
        });

        connection.on("ReceiveAnswer", (fromId, sdp) => {
          console.log("📩 Answer gəldi:", fromId);
          peerRef.current[fromId]?.signal(JSON.parse(sdp));
        });

        connection.on("ReceiveIceCandidate", (fromId, candidate) => {
          console.log("❄ ICE gəldi:", fromId);
          peerRef.current[fromId]?.signal(JSON.parse(candidate));
        });
      });

    return () => {
      Object.values(peerRef.current).forEach((peer) => peer.destroy());
      connectionRef.current?.stop();
    };
  }, [roomId]);

  const createPeer = (toId, stream) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
      config: {
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      },
    });

    peer.on("signal", (signal) => {
      console.log("📤 Offer signal:", signal);
      connectionRef.current
        ?.invoke("SendOffer", toId, JSON.stringify(signal))
        .catch((err) => console.error("❌ Offer invoke error:", err));
    });

    peer.on("stream", (remoteStream) => {
      console.log("📺 Qarşı tərəf video gəldi");
      partnerVideo.current.srcObject = remoteStream;
    });

    peer.on("error", (err) => console.error("❌ Peer error:", err));

    return peer;
  };

  const addPeer = (incomingSignal, fromId, stream) => {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
      config: {
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      },
    });

    peer.on("signal", (signal) => {
      console.log("📤 Answer signal:", signal);
      connectionRef.current
        ?.invoke("SendAnswer", fromId, JSON.stringify(signal))
        .catch((err) => console.error("❌ Answer invoke error:", err));
    });

    peer.on("stream", (remoteStream) => {
      console.log("📺 Qarşı tərəf video gəldi (responder)");
      partnerVideo.current.srcObject = remoteStream;
    });

    peer.on("error", (err) => console.error("❌ Peer error:", err));

    peer.signal(incomingSignal);
    return peer;
  };

  return (
    <div style={{ display: "flex", gap: "20px", justifyContent: "center", marginTop: "40px" }}>
      <div>
        <h3>Siz</h3>
        <video ref={userVideo} autoPlay playsInline muted style={{ width: "300px", borderRadius: "10px" }} />
      </div>
      <div>
        <h3>Həkim / Pasiyent</h3>
        <video ref={partnerVideo} autoPlay playsInline style={{ width: "300px", borderRadius: "10px" }} />
      </div>
    </div>
  );
};

export default VideoCall;
