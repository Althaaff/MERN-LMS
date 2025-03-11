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
import { deleteCourseByIdService } from "@/services";
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
