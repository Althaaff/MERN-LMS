import { Course } from "../../models/course.model.js";

export const getAllStudentViewCourses = async (req, res) => {
  try {
    const coursesList = await Course.find({});

    if (coursesList.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No courses found!",
        data: [],
      });
    }

    return res.status(200).json({
      success: true,
      data: coursesList,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "some error occured!",
    });
  }
};

export const getStudentViewCourseDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const courseDetails = await Course.findById(id);

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
