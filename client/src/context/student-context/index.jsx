import { createContext, useState } from "react";

export const StudentContext = createContext(null);

export default function StudentProvider({ children }) {
  const [studentsCoursesList, setStudentsCoursesList] = useState([]);

  return (
    <StudentContext.Provider
      value={{ studentsCoursesList, setStudentsCoursesList }}
    >
      {children}
    </StudentContext.Provider>
  );
}
