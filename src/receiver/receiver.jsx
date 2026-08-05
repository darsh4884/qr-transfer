import { NavLink } from "react-router-dom";
import { useRef, useState } from "react";
import jsQR from "jsqr";

function Receiver() {
  const camera_ref = useRef(null);
  const canvas_ref = useRef(null);
  const collected_file_data_ref = useRef({});

  const [collected_file_data, setCollectedFileData] = useState({});
  const [total_packets, setTotalPackets] = useState(0);
  const [collected_packets, setCollectedPackets] = useState(0);

  function onFrame() {
    const video = camera_ref.current;
    const canvas = canvas_ref.current;
    const ctx = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0);

    const img_data = ctx.getImageData(0, 0, canvas.width, canvas.height);

    const { data, width, height } = img_data;

    const qr = jsQR(data, width, height);

    if (qr && qr.data) {
      const packet = JSON.parse(qr.data);
      const file_data = collected_file_data_ref.current || {};
      const { data, index, total, fileName, fileType } = packet;
      setTotalPackets(total);

      if (data && !file_data[index]) {
        file_data[index] = data;

        console.log(file_data);
        collected_file_data_ref.current = file_data;
        setCollectedFileData({ ...file_data });
      }

      const packets_we_got = Object.keys(file_data).length;
      setCollectedPackets(packets_we_got);

      console.log(packets_we_got, total_packets);

      if (packets_we_got === total) {
        alert("Whole file received", file_data);
        const file = reconstructFile(file_data, fileName, fileType);
        downloadFile(file);
        return;
      }
    }

    video.requestVideoFrameCallback(onFrame);
  }

  function reconstructFile(fileData, fileName, fileType) {
    // Join chunks in order
    const base64 = Object.keys(fileData)
      .map(Number)
      .sort((a, b) => a - b)
      .map((index) => fileData[index])
      .join("");

    // Decode base64
    const binary = atob(base64);

    // Convert to bytes
    const bytes = new Uint8Array(binary.length);

    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    // Return the reconstructed file
    return new File([bytes], fileName, {
      type: fileType,
    });
  }

  function downloadFile(file) {
    const url = URL.createObjectURL(file);

    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    a.click();

    URL.revokeObjectURL(url);
  }

  async function startCamera() {
    const is_cam_supported = navigator.mediaDevices && navigator.mediaDevices.getUserMedia;
    if (!is_cam_supported) {
      alert("Camera not supported");
      return;
    }
    const cam = camera_ref.current;
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });

    cam.srcObject = stream;
    cam.requestVideoFrameCallback(onFrame);
  }

  async function stopCamera() {
    const cam = camera_ref.current;

    if (!cam || !cam.srcObject) return;

    const stream = cam.srcObject;

    stream.getTracks().forEach((track) => track.stop());

    cam.srcObject = null;
  }

  return (
    <div className="flex flex-col items-start w-full p-2">
      <h1 className="text-2xl">Receiver</h1>
      <p>Keep scanning the QR codes on the other device</p>
      <div className="flex w-full flex-col items-center my-2">
        <div className="w-[400px] h-[400px] border border-gray-400 rounded-md">
          <video className="w-full h-full object-cover" ref={camera_ref} id="camera" autoPlay playsInline />

          <canvas ref={canvas_ref} style={{ display: "none" }} />
        </div>

        <div className="flex gap-2 mt-2">
          <NavLink to="/" className="bg-blue-500 text-white px-4 py-1 rounded">
            Go Back
          </NavLink>
          <button className="bg-pink-600 text-white px-4 py-1 rounded" onClick={startCamera}>
            Start Camera
          </button>
          <button className="bg-pink-600 text-white px-4 py-1 rounded" onClick={stopCamera}>
            Stop Camera
          </button>
        </div>

        <pre>
          Received {collected_packets}/{total_packets} packets
        </pre>
        <p>Latest</p>
      </div>
    </div>
  );
}

export default Receiver;
