import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="topbar">
      <span className="brand">Staffroom</span>
      <nav>
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/" end>Employees</NavLink>
        <NavLink to="/add">Add employee</NavLink>
      </nav>
    </header>
  );
}
