import { useState, useRef } from "react";
import QRCode from "qrcode";

function Sender() {
  const transferring = useRef(false);

  const [data, setData] = useState("");
  const [url, setUrl] = useState(null);
  const [word, setWord] = useState("");

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  async function handleStartTransfer() {
    transferring.current = true;
    transfer();
  }

  function handleStopTransfer() {
    transferring.current = false;
  }

  async function transfer() {
    if (transferring.current === false) return;
    if (!data) return;

    const words = data.split(" ");
    for (const word of words) {
      await generateQR(word);
      await sleep(500);
    }
    transfer();
  }

  function handleChange(e) {
    const value = e.target.value;
    setData(value);
  }

  async function generateQR(word) {
    const url = await QRCode.toDataURL(word);
    setUrl(url);
    setWord(word);
  }

  return (
    <div className="flex flex-col items-start p-4">
      <h1 className="font-bold text-2xl">Sender</h1>
      <p className="text-gray-500">Use the textbox below to write some data that you need to transfer</p>
      <textarea value={data} rows={4} placeholder="Enter your message" className="w-[500px] mb-1 resize-none border border-gray-400 rounded-sm p-4" onChange={handleChange} />
      <div className="flex gap-1 text-white">
        <button className="px-2 text-sm py-1 border rounded-sm border-green-200 bg-green-500" onClick={handleStartTransfer}>
          Start Transferring
        </button>
        <button className="px-2 text-sm py-1 border rounded-sm border-red-200 bg-red-500" onClick={handleStopTransfer}>
          Stop Transferring
        </button>
      </div>

      <div className="flex flex-col  items-center w-[200px] h-[200px] mt-4 border border-black rounded-sm">
        <img src={url} alt="qr" className="w-full h-full object-contain" />
        <span>{word}</span>
      </div>
    </div>
  );
}

export default Sender;
