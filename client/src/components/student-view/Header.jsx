import { Button } from "@/components/ui/button";
import { AuthContext } from "@/context/auth-context";
import { GraduationCap, TvMinimalPlay } from "lucide-react";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

const StudentViewCommonHeader = () => {
  const { resetCredential } = useContext(AuthContext);
  const navigate = useNavigate();

  function handleLogout() {
    resetCredential();
    sessionStorage.clear();
  }

  return (
    <>
      <header className="flex justify-between items-center p-4 border-b relative">
        <div className="flex items-center space-x-4">
          <Link to="/home" className="flex items-center">
            <GraduationCap className="w-8 h-8 mr-4 hover:scale-120 transition-all" />

            <span className="font-extrabold md:text-xl text-[14px]">
              SkillUp Academy
            </span>
          </Link>

          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              className="text-[14px] md:text-[16px] font-medium cursor-pointer border"
              onClick={() => navigate("/courses")}
            >
              Explore
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="font-extrabold md:text-xl text-[14px]">
                My Courses
              </span>
              <TvMinimalPlay className="w-8 h-8 cursor-pointer" />
            </div>
            <Button className="cursor-pointer" onClick={handleLogout}>
              SignOut
            </Button>
          </div>
        </div>
      </header>
    </>
  );
};

export default StudentViewCommonHeader;
