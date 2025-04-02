import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "@/context/auth-context";
import InstructorProvider from "@/context/instructor-context";
import StudentProvider from "@/context/student-context";
import { DarkModeProvider } from "@/context/darkmode-context";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <InstructorProvider>
        <StudentProvider>
          <DarkModeProvider>
            <App />
          </DarkModeProvider>
        </StudentProvider>
      </InstructorProvider>
    </AuthProvider>
  </BrowserRouter>
);
