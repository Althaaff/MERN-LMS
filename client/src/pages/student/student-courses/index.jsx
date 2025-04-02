import Spinner from "@/components/spinner/Spinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AuthContext } from "@/context/auth-context";
import { DarkModeContext } from "@/context/darkmode-context";
import { StudentContext } from "@/context/student-context";
import { fetchStudentBoughtCoursesService } from "@/services";
import { Watch } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const StudentCourses = () => {
  const { auth } = useContext(AuthContext);
  const { darkMode } = useContext(DarkModeContext);

  const [loading, setLoading] = useState(false);

  const { studentBoughtCoursesList, setStudentBoughtCoursesList } =
    useContext(StudentContext);

  console.log("courses bought :", studentBoughtCoursesList);

  const navigate = useNavigate();

  async function fetchStudentBoughtCourses() {
    setLoading(true);
    try {
      const response = await fetchStudentBoughtCoursesService(auth.user?._id);

      console.log("response :", response);

      if (response?.success) {
        setStudentBoughtCoursesList(response?.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStudentBoughtCourses();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="p-4 mt-20">
      <h1 className="text-3xl font-bold mb-8">My Courses</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {setStudentBoughtCoursesList && studentBoughtCoursesList.length > 0 ? (
          studentBoughtCoursesList.map((course) => (
            <Card
              key={course._id}
              className={`flex flex-col ${darkMode ? "bg-black" : "bg-white"}`}
            >
              <CardContent className="p-4 flex-grow">
                <img
                  src={course.courseImage}
                  alt={course.title}
                  className="h-52 w-full rounded-md mb-4 object-cover"
                />

                <h1 className="font-bold mb-1">{course.title}</h1>

                <p className="text-blue-400 text-sm mb-2">
                  {course.instructorName}
                </p>
              </CardContent>

              <CardFooter>
                <Button
                  onClick={() =>
                    navigate(`/course-progress/${course?.courseId}`)
                  }
                  className={`flex-1 cursor-pointer`}
                >
                  <Watch className="h-4 w-4 mr-2" />
                  Start Watching
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <h1 className="text-2xl text-red-500 font-bold mr-2 mt-2">
            No Courses found!
          </h1>
        )}
      </div>
    </div>
  );
};

export default StudentCourses;
