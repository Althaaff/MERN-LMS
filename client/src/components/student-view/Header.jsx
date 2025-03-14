// import SearchBar from "@/components/SearchBar";
import SearchBar from "@/components/search-bar";
import { Button } from "@/components/ui/button";
import { AuthContext } from "@/context/auth-context";
import { DarkModeContext } from "@/context/darkmode-context";
import { searchStudentViewCourseService } from "@/services";
import { GraduationCap, Moon, Sun, TvMinimalPlay } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const StudentViewCommonHeader = () => {
  const { resetCredential } = useContext(AuthContext);
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);
  const [filterCourseByTitle, setFilterCourseByTitle] = useState([]);

  console.log("courses", filterCourseByTitle);

  const toggleMode = () => {
    toggleDarkMode();
  };

  const fetchCourses = async (query = "") => {
    try {
      const response = await searchStudentViewCourseService(query);

      if (response?.success && response?.filteredCourses?.length > 0) {
        setFilterCourseByTitle(response.filteredCourses);
        navigate("/courses", {
          state: { searchedCourses: response.filteredCourses },
        });
      } else {
        toast.info(response.message || "Sorry ! Course not available");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  function handleLogout() {
    resetCredential();
    sessionStorage.clear();
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 flex justify-between items-center p-4 border-b ${
          darkMode ? "bg-black text-white" : "bg-white text-black"
        }`}
      >
        <div className="flex items-center space-x-4">
          <Link to="/home" className="flex items-center">
            <GraduationCap className="w-8 h-8 mr-4 hover:scale-120 transition-all" />

            <span className="font-extrabold md:text-xl text-[14px]">
              SkillUp Academy
            </span>
          </Link>

          <SearchBar onSearch={fetchCourses} />

          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              className="text-[14px] md:text-[16px] font-medium cursor-pointer border"
              onClick={() =>
                location.pathname.includes("/courses")
                  ? null
                  : navigate("/courses")
              }
            >
              Explore
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="p-3 cursor-pointer" onClick={toggleMode}>
                {darkMode ? <Sun /> : <Moon />}
              </span>
              <span
                onClick={() => navigate("/student-courses")}
                className="font-extrabold md:text-xl text-[14px] cursor-pointer"
              >
                My Courses
              </span>
              <TvMinimalPlay className="w-8 h-8 cursor-pointer" />
            </div>
            <Button
              className={`cursor-pointer ${darkMode ? "border" : ""}`}
              onClick={handleLogout}
            >
              SignOut
            </Button>
          </div>
        </div>
      </header>
    </>
  );
};

export default StudentViewCommonHeader;
