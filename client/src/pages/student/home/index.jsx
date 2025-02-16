import { Button } from "@/components/ui/button";
import { AuthContext } from "@/context/auth-context";
import { useContext } from "react";

const StudentHomePage = () => {
  const { resetCredential } = useContext(AuthContext);

  const handleLogout = () => {
    resetCredential();
    sessionStorage.clear();
  };

  return (
    <div>
      <h1>Student Home page!</h1>
      <Button className="p-2" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
};

export default StudentHomePage;
