# Employee Management (React CRUD)

Create, Read, Update and Delete employees. Data is saved in the browser (localStorage).

## Run
```
npm install
npm run dev
```

## Pages
| Route        | Page            | What it does                              |
|--------------|-----------------|-------------------------------------------|
| `/dashboard` | Dashboard       | Totals, payroll, department chart, latest joiners |
| `/`          | Employee list   | Read, search, filter, sort, export CSV, delete |
| `/add`       | Employee form   | Create                                    |
| `/edit/:id`  | Employee form   | Update                                    |

## Validation
- Name: letters only. Email: valid format. Phone: 10 digits starting with 6-9.
- Salary: 1 to 1,00,00,000. Joining date: cannot be in the future.
- **Duplicate email or phone is blocked** and shown live while typing. Same name shows a warning.

## Folder structure
```
src/
  main.jsx, App.jsx, index.css, constants.js, utils.js
  context/    EmployeeContext.jsx, ToastContext.jsx
  components/ Navbar.jsx, Avatar.jsx
  pages/      Dashboard.jsx, EmployeeList.jsx, EmployeeForm.jsx
```
