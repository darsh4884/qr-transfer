import { NavLink } from "react-router-dom";

function Home() {
  return (
    <div className="w-full h-screen flex flex-col gap-2 items-center justify-center">
      <div>
        <h1 className="text-4xl font-semibold">QR-Transfer</h1>
        <p className="text-gray-400">Application that transfers files using QR codes</p>
        <div className="flex gap-1 items-center mt-2">
          <NavLink to="/sender" className="btn btn-primary flex flex-col">
            Sender
          </NavLink>
          <NavLink to="/receiver" className="btn btn-primary flex flex-col">
            Receiver
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default Home;
