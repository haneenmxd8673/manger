import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useEmployees } from "../context/EmployeeContext.jsx";
import { DEPARTMENTS } from "../constants.js";
import { formatSalary } from "../utils.js";
import Avatar from "../components/Avatar.jsx";

export default function Dashboard() {
  const { employees } = useEmployees();

  const stats = useMemo(() => {
    const payroll = employees.reduce((sum, emp) => sum + emp.salary, 0);
    const byDepartment = DEPARTMENTS.map((name) => ({
      name,
      count: employees.filter((emp) => emp.department === name).length,
    }));
    const recent = [...employees].sort((a, b) => b.joinDate.localeCompare(a.joinDate)).slice(0, 4);
    return {
      payroll,
      average: employees.length ? payroll / employees.length : 0,
      byDepartment,
      maxCount: Math.max(1, ...byDepartment.map((d) => d.count)),
      recent,
    };
  }, [employees]);

  return (
    <section>
      <div className="page-head">
        <div>
          <h1>Dashboard</h1>
          <p className="muted">A quick look at your team</p>
        </div>
        <Link to="/add" className="btn btn-primary">Add employee</Link>
      </div>

      <div className="stat-grid">
        <div className="stat"><span className="stat-value">{employees.length}</span><span className="muted">Employees</span></div>
        <div className="stat"><span className="stat-value">{formatSalary(stats.payroll)}</span><span className="muted">Yearly payroll</span></div>
        <div className="stat"><span className="stat-value">{formatSalary(stats.average)}</span><span className="muted">Average salary</span></div>
      </div>

      <div className="panels">
        <div className="panel">
          <h2>People by department</h2>
          {stats.byDepartment.map((d) => (
            <div key={d.name} className="bar-row">
              <span className="bar-label">{d.name}</span>
              <div className="bar-track"><div className="bar-fill" style={{ width: `${(d.count / stats.maxCount) * 100}%` }} /></div>
              <span className="bar-count">{d.count}</span>
            </div>
          ))}
        </div>

        <div className="panel">
          <h2>Latest joiners</h2>
          {stats.recent.length === 0 && <p className="muted">No employees yet.</p>}
          {stats.recent.map((emp) => (
            <div key={emp.id} className="person-row">
              <Avatar name={emp.name} />
              <div>
                <strong>{emp.name}</strong>
                <div className="muted">{emp.role} - joined {emp.joinDate}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
