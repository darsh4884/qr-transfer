import { createRoot } from "react-dom/client";

import App from "./App";

function main() {
  const container = document.getElementById("root");
  const root = createRoot(container);
  root.render(<App />);
}

main();
