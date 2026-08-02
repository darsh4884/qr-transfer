import { useState, useRef } from "react";
import jsQR from "jsqr";

let stream = null;
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

function Receiver() {
  const buffer = useRef(new Set());
  const [final_msg, setFinalMsg] = useState([]);

  const video_ref = useRef(null);

  function scan() {
    const video = video_ref.current;

    if (video.readyState !== video.HAVE_ENOUGH_DATA) {
      requestAnimationFrame(scan);
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    const result = jsQR(imageData.data, imageData.width, imageData.height);

    if (result) {
      const data = result.data;
      if (!buffer.current.has(data)) {
        buffer.current.add(data);
        setFinalMsg([...buffer.current]);
      }
      console.log(buffer);
    }

    requestAnimationFrame(scan);
  }

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: {
            ideal: "environment",
          },
        },
        audio: false,
      });
      video_ref.current.srcObject = stream;
      video_ref.current.onloadedmetadata = () => {
        scan();
      };
    } catch (err) {
      console.error(err);
    }
  }

  function stopCamera() {
    video_ref.current.srcObject.getTracks().forEach((track) => track.stop());
    video_ref.current.srcObject = null;
  }

  return (
    <div className="flex flex-col gap-1 items-start p-5">
      <h1 className="text-2xl font-bold">Receiver</h1>
      <p className="text-gray-400">Use the camera to scan the qr code</p>

      <div className="w-[500px] h-[400px] border rounded-sm">
        <video className="w-full h-full object-cover" ref={video_ref} autoPlay playsInline />
      </div>

      <div className="flex gap-1 text-white">
        <button className="px-2 py-1 bg-green-500 border rounded-sm" onClick={startCamera}>
          Start Camera
        </button>
        <button className="px-2 py-1 bg-red-500 border rounded-sm" onClick={stopCamera}>
          Stop Camera
        </button>
      </div>

      <div>{final_msg.join(" ")}</div>
    </div>
  );
}

export default Receiver;
