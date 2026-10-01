import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useEmployees } from "../context/EmployeeContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { DEPARTMENTS } from "../constants.js";
import { exportToCsv, formatSalary } from "../utils.js";
import Avatar from "../components/Avatar.jsx";

const COLUMNS = [
  { key: "name", label: "Name" },
  { key: "role", label: "Role" },
  { key: "department", label: "Department" },
  { key: "phone", label: "Phone" },
  { key: "salary", label: "Salary" },
  { key: "joinDate", label: "Joined" },
];

export default function EmployeeList() {
  const { employees, dispatch } = useEmployees();
  const { showToast } = useToast();
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");
  const [sort, setSort] = useState({ key: "name", direction: "asc" });

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    const filtered = employees.filter(
      (emp) =>
        (department === "All" || emp.department === department) &&
        [emp.name, emp.role, emp.email, emp.phone].some((text) => text.toLowerCase().includes(term))
    );

    return filtered.sort((a, b) => {
      const first = a[sort.key];
      const second = b[sort.key];
      const result = typeof first === "number" ? first - second : String(first).localeCompare(String(second));
      return sort.direction === "asc" ? result : -result;
    });
  }, [employees, search, department, sort]);

  const toggleSort = (key) =>
    setSort((current) => ({
      key,
      direction: current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));

  const handleDelete = (emp) => {
    if (window.confirm(`Delete ${emp.name}? This cannot be undone.`)) {
      dispatch({ type: "DELETE", id: emp.id });
      showToast(`${emp.name} was deleted.`, "info");
    }
  };

  return (
    <section>
      <div className="page-head">
        <div>
          <h1>Employees</h1>
          <p className="muted">Showing {visible.length} of {employees.length}</p>
        </div>
        <div className="head-actions">
          <button className="btn" onClick={() => exportToCsv(visible)} disabled={visible.length === 0}>Export CSV</button>
          <Link to="/add" className="btn btn-primary">Add employee</Link>
        </div>
      </div>

      <div className="toolbar">
        <input
          type="search"
          placeholder="Search by name, role, email or phone"
          aria-label="Search employees"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select aria-label="Filter by department" value={department} onChange={(e) => setDepartment(e.target.value)}>
          <option>All</option>
          {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
        </select>
      </div>

      {visible.length === 0 ? (
        <p className="empty">No employees match. Clear the search or add a new employee.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                {COLUMNS.map((col) => (
                  <th key={col.key} aria-sort={sort.key === col.key ? (sort.direction === "asc" ? "ascending" : "descending") : "none"}>
                    <button className="sort-btn" onClick={() => toggleSort(col.key)}>
                      {col.label} {sort.key === col.key ? (sort.direction === "asc" ? "\u2191" : "\u2193") : ""}
                    </button>
                  </th>
                ))}
                <th><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {visible.map((emp) => (
                <tr key={emp.id}>
                  <td>
                    <div className="person-row">
                      <Avatar name={emp.name} />
                      <div><strong>{emp.name}</strong><br /><span className="muted">{emp.email}</span></div>
                    </div>
                  </td>
                  <td>{emp.role}</td>
                  <td><span className="tag">{emp.department}</span></td>
                  <td>{emp.phone}</td>
                  <td>{formatSalary(emp.salary)}</td>
                  <td>{emp.joinDate}</td>
                  <td className="actions">
                    <Link to={`/edit/${emp.id}`} className="btn btn-small">Edit</Link>
                    <button className="btn btn-small btn-danger" onClick={() => handleDelete(emp)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
