import { useState, useRef } from "react";
import { NavLink } from "react-router-dom";

import QRCode from "qrcode";

function Sender() {
  const is_transferring_ref = useRef(false);

  const [file, setFile] = useState(null);
  const [current_packet, setCurrent] = useState(0);
  const [total_packets, setTotal] = useState(0);
  const [qr_code, setQrCode] = useState(null);

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  function handleFileSelection(event) {
    const file = event.target.files[0];

    if (!file) {
      alert("You need to choose a file");
      return;
    }

    if (file && file.size > 100000) {
      alert("Your file is too big");
      return;
    }

    setFile(file);
  }

  async function startTransfer() {
    if (!file) {
      alert("No file selected");
      return;
    }

    if (is_transferring_ref.current === true) {
      return;
    }

    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    const data = btoa(String.fromCharCode(...bytes));

    const chunks = [];
    for (let i = 0; i < data.length; i += 100) {
      chunks.push(data.slice(i, i + 100));
    }

    const packets = [];
    let index = 0;
    for (const chunk of chunks) {
      const packet = {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        index: index,
        total: chunks.length,
        data: chunk,
      };
      packets.push(packet);
      index++;
    }

    is_transferring_ref.current = true;
    setTotal(packets.length);
    transfer(packets);
  }

  async function transfer(packets) {
    for (const packet of packets) {
      const is_transferring = is_transferring_ref.current;
      if (is_transferring === false) {
        return;
      }

      console.log(`Showing ${packet.index}/${packet.total} packets`);
      setCurrent(packet.index);

      const json = JSON.stringify(packet);
      const encoded_data = await QRCode.toDataURL(json);
      setQrCode(encoded_data);
      await delay(100);
    }
    transfer(packets);
  }

  function stopTransfer() {
    is_transferring_ref.current = false;
  }

  return (
    <div className="flex flex-col items-start w-full p-2">
      <h1 className="text-2xl">Sender</h1>
      <p>Please upload a file here (100kb max) and click on transfer</p>
      <p>Then use the other phone as Receiver and scan the QR codes that show up</p>
      <input type="file" className="my-2" onChange={handleFileSelection} />

      <div className="flex gap-2">
        <NavLink to="/" className="btn btn-primary rounded-sm">
          Go Back
        </NavLink>
        <button className="btn btn-success rounded-sm" onClick={startTransfer}>
          Start Transfer
        </button>
        <button className="btn btn-danger rounded-sm" onClick={stopTransfer}>
          Stop Transfer
        </button>
      </div>

      <div className="w-[200px] h-[200px] mt-4 border border-gray-400 rounded-sm">
        <img src={qr_code} />

        <p>
          {current_packet} / {total_packets}
        </p>
      </div>
    </div>
  );
}

export default Sender;
