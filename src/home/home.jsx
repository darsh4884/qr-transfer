import { NavLink } from "react-router-dom";

function Home() {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col p-5">
          <h1 className="font-semibold text-4xl">QR-Transfer</h1>
          <p>An app for transferring small files ( upto 100kb ) using QR codes without internet.</p>

          <h1 className="font-semibold text-2xl mt-2">How it works</h1>
          <ol className="list-decimal list-inside space-y-2">
            <li>
              On the device sending the file, select <strong>Sender</strong>.
            </li>
            <li>Choose the file you want to transfer.</li>
            <li>
              Click <strong>Start Transfer</strong>. A sequence of QR codes will begin appearing on the screen.
            </li>
            <li>
              On the receiving device, open the app and select <strong>Receiver</strong>.
            </li>
            <li>Start the camera and keep it pointed at the sender's screen while the QR codes are displayed.</li>
            <li>Wait until all QR codes have been scanned. The file will be reconstructed and downloaded automatically.</li>
          </ol>

          <h1 className="font-semibold text-2xl mt-2">Use this application as</h1>
          <p>Please select how would you like this device to act.</p>

          <div className="flex flex-wrap gap-1">
            <NavLink to="/sender" className="px-5 py-2 rounded-md bg-blue-500 text-white cursor-pointer border-2 hover:border-blue-800">
              Sender
            </NavLink>
            <NavLink to="/receiver" className="px-5 py-2 rounded-md bg-red-500 text-white cursor-pointer border-2 hover:border-red-800">
              Receiver
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
