import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./home/home";
import Sender from "./sender/sender";
import Receiver from "./receiver/receiver";

function App() {
  return (
    <BrowserRouter basename="/qr-transfer">
      <Routes>
        <Route index element={<Home />} />
        <Route path="sender" element={<Sender />} />
        <Route path="receiver" element={<Receiver />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
