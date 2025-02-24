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
import { Delete, Edit } from "lucide-react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

const InstructorCourses = ({ listOfCourses }) => {
  const {
    setCurrentEditedCourseId,
    setCourseLandingFormData,
    setCourseCurriculamFormData,
  } = useContext(InstructorContext);
  const navigate = useNavigate();

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
              {listOfCourses.length > 0
                ? listOfCourses.map((course) => {
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
                            >
                              <Edit className="w-6 h-6" />
                            </Button>

                            <Button variant="ghost" size="sm">
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
