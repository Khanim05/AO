import React, { useEffect, useRef, useState, useMemo } from "react";
import { useParams, useLocation } from "react-router-dom";
import { createVideoSignalConnection } from "../../sockets/videoSignal";
import axios from "axios";
import "./videocall.css";
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
  FaPhoneSlash,
} from "react-icons/fa";

const VideoCall = (props) => {
  const params = useParams();
  const location = useLocation();

  const roomId = props.roomId ?? params.roomId;

const appointmentId = useMemo(() => {
  const rawId =
    typeof props.roomId === "object"
      ? props.roomId?.id
      : props.roomId ?? location.state?.appointmentId ?? params.roomId;

  const parsed = Number(rawId);
  return isNaN(parsed) ? null : parsed;
}, [props.roomId, location.state, params.roomId]);

console.log("🧠 props.roomId:", props.roomId);
console.log("🧠 props.roomId.id:", props.roomId?.id);
console.log("🧠 location.state:", location.state);
console.log("🧠 params.roomId:", params.roomId);
console.log("🧠 Final appointmentId:", appointmentId);




  const [stream, setStream] = useState(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [endTime, setEndTime] = useState(null);
  const [remainingTime, setRemainingTime] = useState("");

  const userVideo = useRef();
  const partnerVideo = useRef();
  const connectionRef = useRef(null);
  const peerConnections = useRef({});

  // ✅ Appointment vaxtını götür
useEffect(() => {
  const token = localStorage.getItem("token");
  const id = props.roomId || location.state?.appointmentId || params.roomId;
  const appointmentId = Number(id);

  console.log("📛 Token:", token);
  console.log("📛 Appointment ID:", appointmentId);

  if (!token || !appointmentId) {
    console.warn("⛔ Token və ya appointmentId yoxdur!");
    return;
  }

  axios
    .get("https://khamiyevbabek-001-site1.ktempurl.com/api/Schedule/patient", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => {
      console.log("📦 Gələn cavab:", res.data);
      const appointment = res.data.find((a) => a.id === appointmentId);
      console.log("🎯 Tapılan appointment:", appointment);
      if (appointment) {
        setEndTime(new Date(appointment.endTime));
      } else {
        console.warn("❗ Görüş tapılmadı:", appointmentId);
      }
    })
    .catch((err) => {
      console.error("🛑 Schedule API xətası:", err);
    });
}, [props.roomId, location.state, params.roomId]);


  // ✅ Qalan vaxt
  useEffect(() => {
    if (!endTime) return;

    const interval = setInterval(() => {
      const now = new Date();
      const diff = Math.max(0, endTime - now);
      const min = Math.floor(diff / 60000);
      const sec = Math.floor((diff % 60000) / 1000);
      setRemainingTime(
        `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`
      );

      if (diff <= 0) {
        clearInterval(interval);
        connectionRef.current?.stop();
        window.location.href = "/";
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  // ✅ WebRTC + SignalR bağlantısı
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const connection = createVideoSignalConnection(token);
    connectionRef.current = connection;

    connection
      .start()
      .then(() => connection.invoke("JoinRoom", roomId))
      .catch((err) => console.error("SignalR xətası:", err));

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((localStream) => {
        setStream(localStream);
        userVideo.current.srcObject = localStream;

        connection.on("AllUsers", (users) => {
          users.forEach((userId) => createOffer(userId, localStream));
        });

        connection.on("UserJoined", (userId) => {
          console.log("User joined:", userId);
        });

        connection.on("ReceiveOffer", async (fromId, offerStr) => {
          await createAnswer(fromId, localStream, JSON.parse(offerStr));
        });

        connection.on("ReceiveAnswer", async (fromId, answerStr) => {
          await peerConnections.current[fromId]?.setRemoteDescription(
            new RTCSessionDescription(JSON.parse(answerStr))
          );
        });

        connection.on("ReceiveIceCandidate", async (fromId, candidateStr) => {
          await peerConnections.current[fromId]?.addIceCandidate(
            new RTCIceCandidate(JSON.parse(candidateStr))
          );
        });
      });

    return () => {
      Object.values(peerConnections.current).forEach((pc) => pc.close());
      connectionRef.current?.stop();
    };
  }, [roomId]);

  const createPeer = (userId) => {
    const peer = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        connectionRef.current?.invoke(
          "SendIceCandidate",
          userId,
          JSON.stringify(event.candidate)
        );
      }
    };

    peer.ontrack = (event) => {
      const [remoteStream] = event.streams;
      if (remoteStream && partnerVideo.current) {
        partnerVideo.current.srcObject = remoteStream;
      }
    };

    return peer;
  };

  const createOffer = async (toId, localStream) => {
    const peer = createPeer(toId);
    peerConnections.current[toId] = peer;
    localStream
      .getTracks()
      .forEach((track) => peer.addTrack(track, localStream));
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    connectionRef.current?.invoke("SendOffer", toId, JSON.stringify(offer));
  };

  const createAnswer = async (fromId, localStream, offer) => {
    const peer = createPeer(fromId);
    peerConnections.current[fromId] = peer;
    localStream
      .getTracks()
      .forEach((track) => peer.addTrack(track, localStream));
    await peer.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    connectionRef.current?.invoke("SendAnswer", fromId, JSON.stringify(answer));
  };

  const handleToggleMic = () => {
    stream
      ?.getAudioTracks()
      .forEach((track) => (track.enabled = !track.enabled));
    setIsMicOn((prev) => !prev);
  };

  const handleToggleCam = () => {
    stream
      ?.getVideoTracks()
      .forEach((track) => (track.enabled = !track.enabled));
    setIsCamOn((prev) => !prev);
  };

  const handleLeave = () => setShowConfirmModal(true);

  return (
    <div className="video-call-container">
      <video ref={partnerVideo} autoPlay playsInline className="remote-video" />
      <video
        ref={userVideo}
        autoPlay
        playsInline
        muted
        className="local-video"
      />

      <div className="call-timer">Qalan vaxt: {remainingTime || "00:00"}</div>

      <div className="control-panel">
        <button className="control-button" onClick={handleToggleMic}>
          {isMicOn ? <FaMicrophone /> : <FaMicrophoneSlash />}
        </button>
        <button className="control-button" onClick={handleToggleCam}>
          {isCamOn ? <FaVideo /> : <FaVideoSlash />}
        </button>
        <button className="control-button leave" onClick={handleLeave}>
          <FaPhoneSlash />
        </button>
      </div>

      {showConfirmModal && (
        <div
          className="custom-backdrop"
          onClick={() => setShowConfirmModal(false)}
        >
          <div className="custom-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Görüşdən çıxmaq istəyirsiniz?</h3>
            <div className="custom-modal-buttons">
              <button onClick={() => setShowConfirmModal(false)}>
                Ləğv et
              </button>
              <button
                className="leave"
                onClick={() => {
                  connectionRef.current?.stop();
                  window.location.href = "/";
                }}
              >
                Çıx
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoCall;
