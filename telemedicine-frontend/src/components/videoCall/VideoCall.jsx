import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createVideoSignalConnection } from "../../sockets/videoSignal";
import "./videocall.css";
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
  FaPhoneSlash,
} from "react-icons/fa";

const VideoCall = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [stream, setStream] = useState(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const userVideo = useRef();
  const partnerVideo = useRef();
  const connectionRef = useRef(null);
  const peerConnections = useRef({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const connection = createVideoSignalConnection(token);
    connectionRef.current = connection;

    connection
      .start()
      .then(() => {
        connection.invoke("JoinRoom", roomId);
      })
      .catch((err) => console.error("SignalR error:", err));

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((localStream) => {
        setStream(localStream);
        userVideo.current.srcObject = localStream;

        connection.on("AllUsers", (users) => {
          users.forEach((userId) => {
            createOffer(userId, localStream);
          });
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
      .getAudioTracks()
      .forEach((track) => (track.enabled = !track.enabled));
    setIsMicOn((prev) => !prev);
  };

  const handleToggleCam = () => {
    stream
      .getVideoTracks()
      .forEach((track) => (track.enabled = !track.enabled));
    setIsCamOn((prev) => !prev);
  };

  const handleLeave = () => {
    console.log("🟡 Leave clicked");
    setShowConfirmModal(true);
  };

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
      {/* 👇 BURA əlavə et modalı */}
      {showConfirmModal && (
  <div className="custom-backdrop" onClick={() => setShowConfirmModal(false)}>
    <div className="custom-modal" onClick={(e) => e.stopPropagation()}>
      <h3>Görüşdən çıxmaq istəyirsiniz?</h3>
      <div className="custom-modal-buttons">
        <button onClick={() => setShowConfirmModal(false)}>Ləğv et</button>
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
