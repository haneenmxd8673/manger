import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEmployees } from "../context/EmployeeContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { DEPARTMENTS, EMPTY_FORM } from "../constants.js";
import { findDuplicates, validate } from "../utils.js";

export default function EmployeeForm() {
  const { id } = useParams(); // present only on /edit/:id
  const navigate = useNavigate();
  const { employees, dispatch } = useEmployees();
  const { showToast } = useToast();

  const isEdit = Boolean(id);
  const existing = employees.find((emp) => emp.id === id);

  const [form, setForm] = useState(existing ? { ...existing, salary: String(existing.salary) } : EMPTY_FORM);
  const [errors, setErrors] = useState({});

  if (isEdit && !existing) {
    return (
      <section>
        <h1>Employee not found</h1>
        <p className="muted">This employee may have been deleted.</p>
        <Link to="/" className="btn">Back to employees</Link>
      </section>
    );
  }

  // Live duplicate check while typing
  const duplicates = findDuplicates(form, employees, id);
  const liveErrors = {
    email: duplicates.email && `This email is already used by ${duplicates.email.name}.`,
    phone: duplicates.phone && `This phone number is already used by ${duplicates.phone.name}.`,
  };
  const nameWarning = duplicates.name && `An employee named ${duplicates.name.name} already exists. Check this is not a repeat.`;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const foundErrors = validate(form, employees, id);
    setErrors(foundErrors);

    if (Object.keys(foundErrors).length > 0) {
      const isDuplicate = Object.values(foundErrors).some((message) => message.includes("already used"));
      showToast(isDuplicate ? "Duplicate email or phone found. Please fix it." : "Please fix the highlighted fields.", "error");
      return;
    }

    const employee = {
      ...form,
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      role: form.role.trim(),
      salary: Number(form.salary),
      id: isEdit ? id : crypto.randomUUID(),
    };
    dispatch({ type: isEdit ? "UPDATE" : "ADD", payload: employee });
    showToast(isEdit ? `${employee.name} was updated.` : `${employee.name} was added.`);
    navigate("/");
  };

  const renderField = (name, label, props = {}, warning) => {
    const message = errors[name] || liveErrors[name];
    return (
      <div className="field">
        <label htmlFor={name}>{label}</label>
        <input id={name} name={name} value={form[name]} onChange={handleChange} aria-invalid={Boolean(message)} {...props} />
        {message && <span className="error" role="alert">{message}</span>}
        {!message && warning && <span className="warning">{warning}</span>}
      </div>
    );
  };

  return (
    <section className="form-page">
      <h1>{isEdit ? "Edit employee" : "Add employee"}</h1>
      <form onSubmit={handleSubmit} noValidate>
        {renderField("name", "Full name", {}, nameWarning)}
        {renderField("email", "Email", { type: "email" })}
        {renderField("phone", "Phone", { inputMode: "numeric", maxLength: 10 })}
        <div className="field">
          <label htmlFor="department">Department</label>
          <select id="department" name="department" value={form.department} onChange={handleChange}>
            {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
          </select>
        </div>
        {renderField("role", "Job role")}
        {renderField("salary", "Yearly salary (INR)", { type: "number", min: 0 })}
        {renderField("joinDate", "Joining date", { type: "date" })}
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">{isEdit ? "Save changes" : "Add employee"}</button>
          <Link to="/" className="btn">Cancel</Link>
        </div>
      </form>
    </section>
  );
}
