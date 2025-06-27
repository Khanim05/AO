import React from 'react'
import {useParams} from "react-router-dom"
import VideoCall from '../../components/videoCall/VideoCall'
const VideoCallPage = () => {
  const { roomId } = useParams();
  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ textAlign: "center" }}>Görüş otağına xoş gəlmisiniz</h2>
      <VideoCall roomId={roomId} />
    </div>
  )
}

export default VideoCallPage
