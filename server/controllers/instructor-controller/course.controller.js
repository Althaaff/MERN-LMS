import { Course } from "../../models/course.model.js";

export const createNewCourse = async (req, res) => {
  try {
    const courseData = req.body;
    const newlyCreatedCourse = new Course(courseData);
    const saveCourse = newlyCreatedCourse.save();

    if (saveCourse) {
      res.status(200).json({
        success: true,
        message: "course created successfullly!",
        data: saveCourse,
      });
    }
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "some error occured!",
    });
  }
};

export const getAllCourses = async (req, res) => {
  try {
    const coursesList = new Course.find({});

    return res.status(200).json({
      success: true,
      data: coursesList,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "some error occured!",
    });
  }
};

export const getCourseDetailsById = async (req, res) => {
  try {
    const { id } = req.params;
    const courseDetails = await Course.findById(id);

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "course not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: courseDetails,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "some error occured!",
    });
  }
};

export const updateCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedCourseData = req.body;

    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      updatedCourseData,
      { new: true }
    );

    if (!updatedCourse) {
      return res.status(200).json({
        success: false,
        message: "Course not found!",
      });
    }

    res.status(200).json({
      success: true,
      message: "course updated successfullly!",
      data: updatedCourse,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "some error occured!",
    });
  }
};
