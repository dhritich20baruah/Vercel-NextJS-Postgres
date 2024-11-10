"use client";
import { useEffect, useState, useRef } from "react";

const CameraComponent = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);

  useEffect(() => {
    if (isCameraOn) {
      enableCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isCameraOn]);

  const enableCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing the camera: ", error);
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) {
      const tracks = stream.getTrack();
      tracks.forEach((tracks) => tracks.stop());
    }
  };

  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (canvas && video) {
      const context = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      // Convert canvas to image data URL and save it
      const dataUrl = canvas.toDataURL("image/png");
      setCapturedPhoto(dataUrl); // Set the captured photo to display below
    }
  };

  return (
    <div className="camera-component">
      <button onClick={() => setIsCameraOn((prev) => !prev)}>
        {isCameraOn ? "Turn Off Camera" : "Turn On Camera"}
      </button>

      {isCameraOn && (
        <div>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            style={{ width: "100%", height: "auto" }}
          />
          <button onClick={capturePhoto}>Capture Photo</button>
          <canvas ref={canvasRef} style={{ display: "none" }} />
        </div>
      )}
      {capturedPhoto && (
        <div>
          <h3>Captured Photo:</h3>
          <img src={capturedPhoto} alt="Captured" style={{ width: "100%" }} />
        </div>
      )}
    </div>
  );
};

export default CameraComponent;
