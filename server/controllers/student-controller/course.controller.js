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
    return res.status(200).json({
      success: true,
      data: courseDetails,
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

export const searchCourses = async (req, res) => {
  try {
    const { title } = req.query; // Extract query from request
    console.log("query:", title);

    if (!title || title.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Search query is required!",
      });
    }

    // Use MongoDB's regex for case-insensitive search
    const courses = await Course.find({
      title: { $regex: title, $options: "i" },
    });

    // Correct way to check if no courses are found
    if (!courses) {
      return res.status(404).json({
        success: false,
        message: "finding course not found!",
      });
    }

    res.status(200).json({
      success: true,
      filteredCourses: courses,
    });
  } catch (error) {
    console.error("Error in searchCourses:", error);
    return res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

export const getPopularCourses = async (req, res, next) => {
  try {
    const popularCourses = await Course.find({
      $expr: { $gt: [{ $size: "$students" }, 0] }, // Fetch only courses with more than 3 students
    })
      .sort({ students: -1 }) // Sort by number of students enrolled
      .limit(10); // Get top 10 popular courses

    res.status(200).json({
      success: true,
      message: "Popular courses fetched successfully",
      courses: popularCourses.map((course) => ({
        ...course.toObject(),
        enrolledStudents: course.students.length, // Count enrolled students dynamically
      })),
    });
  } catch (error) {
    next(error);
  }
};
