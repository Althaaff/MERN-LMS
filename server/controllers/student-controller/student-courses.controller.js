import { StudentCourses } from "../../models/student.course.model.js";

export const getCoursesByStudentId = async (req, res) => {
  try {
    const { studentId } = req.params;

    // console.log("id :", studentId);

    const studentBoughtCourses = await StudentCourses.findOne({
      userId: studentId,
    });

    // console.log("studentBoughtCourses :", studentBoughtCourses);

    if (studentBoughtCourses) {
      return res.status(200).json({
        success: true,
        data: studentBoughtCourses.courses,
      });
    }
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};
