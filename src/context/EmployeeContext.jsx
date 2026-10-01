import { createContext, useContext, useEffect, useReducer } from "react";
import { SEED_DATA, STORAGE_KEY } from "../constants.js";

const EmployeeContext = createContext(null);

function loadEmployees() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : SEED_DATA;
  } catch {
    return SEED_DATA;
  }
}

function employeeReducer(state, action) {
  switch (action.type) {
    case "ADD":
      return [...state, action.payload];
    case "UPDATE":
      return state.map((emp) => (emp.id === action.payload.id ? action.payload : emp));
    case "DELETE":
      return state.filter((emp) => emp.id !== action.id);
    default:
      return state;
  }
}

export function EmployeeProvider({ children }) {
  const [employees, dispatch] = useReducer(employeeReducer, [], loadEmployees);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
  }, [employees]);

  return (
    <EmployeeContext.Provider value={{ employees, dispatch }}>
      {children}
    </EmployeeContext.Provider>
  );
}

export function useEmployees() {
  return useContext(EmployeeContext);
}
