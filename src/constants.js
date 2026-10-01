export const STORAGE_KEY = "employees";

export const DEPARTMENTS = ["Engineering", "Design", "Sales", "HR", "Finance", "Support"];

export const EMPTY_FORM = {
  name: "",
  email: "",
  phone: "",
  department: DEPARTMENTS[0],
  role: "",
  salary: "",
  joinDate: "",
};

export const SEED_DATA = [
  { id: "1", name: "Asha Menon", email: "asha@example.com", phone: "9876543210", department: "Engineering", role: "Frontend Developer", salary: 600000, joinDate: "2024-02-12" },
  { id: "2", name: "Rahul Nair", email: "rahul@example.com", phone: "9123456780", department: "Sales", role: "Sales Executive", salary: 420000, joinDate: "2023-08-01" },
  { id: "3", name: "Meera Joseph", email: "meera@example.com", phone: "9988776655", department: "HR", role: "HR Manager", salary: 550000, joinDate: "2022-05-20" },
];
