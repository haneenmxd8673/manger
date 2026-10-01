import { Routes, Route, Link } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import EmployeeList from "./pages/EmployeeList.jsx";
import EmployeeForm from "./pages/EmployeeForm.jsx";

function NotFound() {
  return (
    <section>
      <h1>Page not found</h1>
      <Link to="/" className="btn">Go to employees</Link>
    </section>
  );
}

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<EmployeeList />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add" element={<EmployeeForm />} />
          <Route path="/edit/:id" element={<EmployeeForm />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
}
