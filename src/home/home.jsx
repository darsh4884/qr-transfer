import { NavLink } from "react-router-dom";

function Home() {
  return (
    <div>
      <h1>Use this app as</h1>
      <NavLink to="/sender">
        <button>Sender</button>
      </NavLink>
      <NavLink to="/receiver">
        <button>Receiver</button>
      </NavLink>
    </div>
  );
}

export default Home;
