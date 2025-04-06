import Spinner from "@/components/spinner/Spinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  courseCurriculumInitialFormData,
  courseLandingInitialFormData,
} from "@/config";
import { InstructorContext } from "@/context/instructor-context";
import { createCourseQuizService, deleteCourseByIdService } from "@/services";
import { Delete, Edit } from "lucide-react";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const InstructorCourses = ({ listOfCourses }) => {
  const {
    setCurrentEditedCourseId,
    setCourseLandingFormData,
    setCourseCurriculamFormData,
  } = useContext(InstructorContext);
  const navigate = useNavigate();

  const [courses, setCourses] = useState(listOfCourses);

  console.log("courses :", courses);
  const [createdQuiz, setCreatedQuiz] = useState([]);
  const [creatingQuiz, setCreatingQuiz] = useState({});

  console.log("created course :", createdQuiz);

  const handleDeleteCourse = async (courseId) => {
    try {
      const response = await deleteCourseByIdService(courseId);
      console.log("response", response);

      if (response?.success) {
        toast.success("course deleted successfully.");

        // update the state in the Ui:
        setCourses((prevCourse) =>
          prevCourse?.filter((course) => course?._id !== courseId)
        );
      } else {
        toast.error("somthing went wrong.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // handle create quizz :
  const handleCreteQuiz = async (courseId) => {
    console.log("course id", courseId);
    try {
      setCreatingQuiz((prev) => ({ ...prev, [courseId]: true }));

      const response = await createCourseQuizService(courseId);

      if (response?.success) {
        console.log("response", response);
        setCreatedQuiz(response?.quiz);

        // update the specific course with new quiz data :
        setCourses((prevCourse) =>
          prevCourse.map((course) =>
            course?._id === courseId
              ? { ...course, quiz: response?.quiz }
              : course
          )
        );

        toast.success("Quiz created successfully..");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setCreatingQuiz((prev) => ({ ...prev, [courseId]: false }));
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-start">
        <CardTitle className="text-3xl font-extrabold">All Courses</CardTitle>

        <Button
          onClick={() => {
            setCurrentEditedCourseId(null);
            setCourseLandingFormData(courseLandingInitialFormData);
            setCourseCurriculamFormData(courseCurriculumInitialFormData);
            navigate("/instructor/create-new-course");
          }}
          className="p-6 cursor-pointer"
        >
          Create New Courses
        </Button>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Courses</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Quiz</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses?.length > 0
                ? courses?.map((course) => {
                    return (
                      <>
                        <TableRow>
                          <TableCell className="font-medium">
                            {course.title}
                          </TableCell>
                          <TableCell>{course?.students?.length}</TableCell>
                          <TableCell>${course?.pricing}</TableCell>
                          <TableCell>
                            <Button
                              as="label"
                              variant="outline"
                              className="cursor-pointer  bg-blue-500 text-white duration-800 transition-all"
                              onClick={() => handleCreteQuiz(course?._id)}
                            >
                              {creatingQuiz[course?._id] ? (
                                <Spinner size={"20"} color={"white"} />
                              ) : (
                                "Create Quiz"
                              )}
                            </Button>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              onClick={() => {
                                navigate(
                                  `/instructor/edit-course/${course?._id}`
                                );
                              }}
                              variant="ghost"
                              size="sm"
                              className="cursor-pointer"
                            >
                              <Edit className="w-6 h-6" />
                            </Button>

                            <Button
                              onClick={() => handleDeleteCourse(course?._id)}
                              variant="ghost"
                              size="sm"
                              className="cursor-pointer"
                            >
                              <Delete className="w-6 h-6" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      </>
                    );
                  })
                : null}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default InstructorCourses;
