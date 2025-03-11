import { createContext, useEffect, useState } from "react";

const DarkModeContext = createContext(null);

const DarkModeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  return (
    <div>
      <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
        <div
          className={
            darkMode
              ? "bg-black text-white min-h-screen"
              : "bg-white text-black min-h-screen"
          }
        >
          {children}
        </div>
      </DarkModeContext.Provider>
    </div>
  );
};

export { DarkModeContext, DarkModeProvider };
