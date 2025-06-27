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
        if (userVideo.current) {
          userVideo.current.srcObject = currentStream;
        }

        connection.start().then(() => {
          connection.invoke("JoinRoom", roomId);
        });

        // ✅ Qarşı tərəflər otaqdadırsa
        connection.on("AllUsers", (users) => {
          console.log("💡 AllUsers gəldi:", users);
          users.forEach((userId) => {
            const peer = createPeer(
              userId,
              connection.connectionId,
              currentStream
            );
            peerRef.current[userId] = peer;
          });
        });

        // ✅ Yeni qoşulan biri varsa
        connection.on("UserJoined", (userId) => {
          console.log("➕ Yeni qoşulan:", userId);
          const peer = createPeer(
            userId,
            connection.connectionId,
            currentStream
          );
          peerRef.current[userId] = peer;
        });

        // ✅ Qarşı tərəfdən siqnal alındı
        connection.on("ReceiveOffer", (fromUserId, sdp) => {
          console.log("📡 Siqnal gəldi:", fromUserId);
          const peer = addPeer(JSON.parse(sdp), fromUserId, currentStream);
          peerRef.current[fromUserId] = peer;
        });

        // ✅ Qarşı tərəfə cavab göndər
        connection.on("ReceiveAnswer", (fromUserId, sdp) => {
          console.log("📩 Geri siqnal gəldi:", fromUserId);
          peerRef.current[fromUserId]?.signal(JSON.parse(sdp));
        });
      });

    return () => {
      Object.values(peerRef.current).forEach((peer) => peer.destroy());
      connectionRef.current?.stop();
    };
  }, [roomId]);

  const createPeer = (userToSignal, callerID, stream) => {
    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on("signal", (signal) => {
      connectionRef.current?.invoke(
        "SendOffer",
        userToSignal,
        JSON.stringify(signal)
      );
    });

    peer.on("stream", (remoteStream) => {
      if (partnerVideo.current) {
        partnerVideo.current.srcObject = remoteStream;
      }
    });

    return peer;
  };

  const addPeer = (incomingSignal, callerID, stream) => {
    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on("signal", (signal) => {
      connectionRef.current?.invoke(
        "SendAnswer",
        callerID,
        JSON.stringify(signal)
      );
    });

    peer.on("stream", (remoteStream) => {
      if (partnerVideo.current) {
        partnerVideo.current.srcObject = remoteStream;
      }
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
