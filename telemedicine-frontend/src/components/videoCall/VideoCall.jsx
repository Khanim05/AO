// Yeni WebRTC bazlı video call komponenti (SignalR backendə uyğun)

import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { createVideoSignalConnection } from "../../sockets/videoSignal";

const VideoCall = () => {
  const { roomId } = useParams();
  const [stream, setStream] = useState(null);
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
        console.log("🟢 SignalR bağlantısı uğurla başladı");
        connection.invoke("JoinRoom", roomId);
      })
      .catch((err) => console.error("❌ SignalR bağlantı xətası:", err));

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((localStream) => {
        console.log("🎥 Stream alındı:", localStream);
        console.log("🎙 Audio tracks:", localStream.getAudioTracks());
        setStream(localStream);
        if (userVideo.current) {
          userVideo.current.srcObject = localStream;
        }

        connection.on("AllUsers", (users) => {
          console.log("💡 AllUsers gəldi:", users);
          users.forEach((userId) => {
            createOffer(userId, localStream);
          });
        });

        connection.on("UserJoined", (userId) => {
          console.log("➕ Yeni qoşulan:", userId);
        });

        connection.on("ReceiveOffer", async (fromId, offerStr) => {
          console.log("📡 Offer gəldi:", fromId);
          await createAnswer(fromId, localStream, JSON.parse(offerStr));
        });

        connection.on("ReceiveAnswer", async (fromId, answerStr) => {
          console.log("📩 Answer gəldi:", fromId);
          await peerConnections.current[fromId]?.setRemoteDescription(
            new RTCSessionDescription(JSON.parse(answerStr))
          );
        });

        connection.on("ReceiveIceCandidate", async (fromId, candidateStr) => {
          console.log("❄ ICE Candidate gəldi:", fromId);
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
  console.log("🗺 Qarşı tərəfdən stream:", event);
  const [remoteStream] = event.streams;

  if (remoteStream && partnerVideo.current) {
    partnerVideo.current.srcObject = remoteStream;
    partnerVideo.current.muted = false;
    partnerVideo.current.volume = 1;
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

  return (
    <div
      style={{
        display: "flex",
        gap: "20px",
        justifyContent: "center",
        marginTop: "40px",
      }}
    >
      <div>
        <h3>Siz</h3>
        <video
          ref={userVideo}
          autoPlay
          playsInline
          muted
          style={{ width: "300px", borderRadius: "10px" }}
        />
      </div>
      <div>
        <h3>Həkim / Pasiyent</h3>
        <video
          ref={partnerVideo}
          autoPlay
          playsInline
          style={{ width: "300px", borderRadius: "10px" }}
        />
      </div>
    </div>
  );
};

export default VideoCall;
