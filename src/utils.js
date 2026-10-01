/** Formats a number as Indian rupees, e.g. 600000 -> Rs 6,00,000 */
export const formatSalary = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

/** "Asha Menon" -> "AM" */
export const getInitials = (name) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");

/**
 * Finds existing employees that share an email, phone or name with the form.
 * The employee being edited (currentId) is ignored so they don't clash with themselves.
 */
export const findDuplicates = (form, employees, currentId) => {
  const others = employees.filter((emp) => emp.id !== currentId);
  const email = form.email.trim().toLowerCase();
  const phone = form.phone.trim();
  const name = form.name.trim().toLowerCase();

  return {
    email: email ? others.find((emp) => emp.email.toLowerCase() === email) : undefined,
    phone: phone ? others.find((emp) => emp.phone === phone) : undefined,
    name: name ? others.find((emp) => emp.name.toLowerCase() === name) : undefined,
  };
};

/** Returns an object of error messages. An empty object means the form is valid. */
export const validate = (form, employees, currentId) => {
  const errors = {};
  const today = new Date().toISOString().slice(0, 10);
  const duplicates = findDuplicates(form, employees, currentId);

  if (!/^[A-Za-z][A-Za-z .'-]{1,59}$/.test(form.name.trim())) {
    errors.name = "Enter a valid name using letters only (2 to 60 characters).";
  }

  if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
    errors.email = "Enter a valid email, like name@company.com.";
  } else if (duplicates.email) {
    errors.email = `This email is already used by ${duplicates.email.name}.`;
  }

  if (!/^[6-9]\d{9}$/.test(form.phone)) {
    errors.phone = "Enter a 10-digit mobile number starting with 6, 7, 8 or 9.";
  } else if (duplicates.phone) {
    errors.phone = `This phone number is already used by ${duplicates.phone.name}.`;
  }

  if (form.role.trim().length < 2) errors.role = "Enter the job role.";

  const salary = Number(form.salary);
  if (!(salary >= 1 && salary <= 10000000)) errors.salary = "Enter a yearly salary between 1 and 1,00,00,000.";

  if (!form.joinDate) errors.joinDate = "Choose the joining date.";
  else if (form.joinDate > today) errors.joinDate = "Joining date cannot be in the future.";

  return errors;
};

/** Downloads the given employees as a CSV file. */
export const exportToCsv = (employees) => {
  const headers = ["Name", "Email", "Phone", "Department", "Role", "Salary", "Joined"];
  const escape = (value) => `"${String(value).replace(/"/g, '""')}"`;
  const rows = employees.map((e) => [e.name, e.email, e.phone, e.department, e.role, e.salary, e.joinDate]);
  const csv = [headers, ...rows].map((row) => row.map(escape).join(",")).join("\n");

  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  link.download = "employees.csv";
  link.click();
  URL.revokeObjectURL(link.href);
};
