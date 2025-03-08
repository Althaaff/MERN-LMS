import { Course } from "../../models/course.model.js";
import { StudentCourses } from "../../models/student.course.model.js";

export const getAllStudentViewCourses = async (req, res) => {
  try {
    const {
      category = "",
      level = "",
      primaryLanguage = "",
      sortBy = "price-lowtohigh",
    } = req.query;

    let filters = {};

    // Using $in in MongoDB Filter The $in operator in MongoDB checks if a field’s value matches any value in an array :
    if (category) {
      filters.category = { $in: category.split(",") }; // split method returns array in JS
    }

    if (level) {
      filters.level = { $in: level.split(",") };
    }

    if (primaryLanguage) {
      filters.primaryLanguage = { $in: primaryLanguage.split(",") };
    }

    let sortParam = {};

    switch (sortBy.toLowerCase()) {
      case "price-lowtohigh":
        sortParam = { pricing: 1 };
        break;
      case "price-hightolow":
        sortParam = { pricing: -1 };
        break;
      case "title-atoz":
        sortParam = { title: 1 };
        break;
      case "title-ztoa":
        sortParam = { title: -1 };
        break;
      default:
        sortParam = { pricing: 1 };
        break;
    }

    const coursesList = await Course.find(filters).sort(sortParam);

    return res.status(200).json({
      success: true,
      data: coursesList,
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

export const getStudentViewCourseDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const courseDetails = await Course.findById(id);

    console.log("course details :", courseDetails);

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "No course details found!",
        data: null,
      });
    }

    // Get total enrolled students count
    const enrolledStudentsCount = courseDetails.students.length;

    return res.status(200).json({
      success: true,
      data: courseDetails,
      totalStudents: enrolledStudentsCount, // Include total students //
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "some error occured!",
    });
  }
};

export const checkCoursePurchaseInfo = async (req, res) => {
  try {
    const { id, studentId } = req.params;

    const studentCourses = await StudentCourses.findOne({
      userId: studentId,
    });

    const ifStudentAlreadyBoughtCurrentCourse = studentCourses
      ? studentCourses.courses.findIndex((item) => item.courseId === id) > -1
      : false;

    return res.status(200).json({
      success: true,
      data: ifStudentAlreadyBoughtCurrentCourse,
    });
  } catch (error) {
    console.log(error);

    return res
      .status(500)
      .json({ success: false, message: "some error occured!" });
  }
};
