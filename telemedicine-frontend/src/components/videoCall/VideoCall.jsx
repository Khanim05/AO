// ✅ VideoCall.jsx (tam frontend versiya) - Qarşılıqlı görütü qura bilən
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Peer from "simple-peer";
import { createVideoSignalConnection } from "../../sockets/videoSignal";

const VideoCall = () => {
  const { roomId } = useParams();
  const [stream, setStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const peerRef = useRef(null);
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
        if (userVideo.current) userVideo.current.srcObject = currentStream;

        connection.start().then(() => {
          connection.invoke("JoinRoom", roomId);
        });

        // 1. Otaqdaki digər userlər göndərilir (ilk daxil olana)
        connection.on("AllUsers", (users) => {
          if (users.length > 0) {
            const peer = createPeer(users[0], connection.connectionId, currentStream);
            peerRef.current = peer;
          }
        });

        // 2. Sonradan biri otağa daxil olarsa
        connection.on("UserJoined", (userId) => {
          const peer = createPeer(userId, connection.connectionId, currentStream);
          peerRef.current = peer;
        });

        // 3. Qarşı tərəfdən signal gəlirsə
        connection.on("ReceiveSignal", ({ callerId, signal }) => {
          const peer = addPeer(signal, callerId, currentStream);
          peerRef.current = peer;
        });

        // 4. Qarşı tərəfə cavab siqnalı göndər
        connection.on("ReturnSignal", ({ signal }) => {
          peerRef.current?.signal(signal);
        });
      });

    return () => {
      if (peerRef.current) peerRef.current.destroy();
      connectionRef.current?.stop();
    };
  }, [roomId]);

  const createPeer = (userToSignal, callerID, stream) => {
    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on("signal", (signal) => {
      connectionRef.current?.invoke("SendSignal", {
        signal,
        targetUserId: userToSignal,
      });
    });

    peer.on("stream", (remoteStream) => {
      setRemoteStream(remoteStream);
      if (partnerVideo.current) partnerVideo.current.srcObject = remoteStream;
    });

    return peer;
  };

  const addPeer = (incomingSignal, callerID, stream) => {
    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on("signal", (signal) => {
      connectionRef.current?.invoke("ReturnSignal", {
        signal,
        callerId: callerID,
      });
    });

    peer.on("stream", (remoteStream) => {
      setRemoteStream(remoteStream);
      if (partnerVideo.current) partnerVideo.current.srcObject = remoteStream;
    });

    peer.signal(incomingSignal);
    return peer;
  };

  return (
    <div
      className="video-room"
      style={{
        display: "flex",
        gap: "20px",
        justifyContent: "center",
        marginTop: "40px",
        flexWrap: "wrap",
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
