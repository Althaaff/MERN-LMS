import { Course } from "../../models/course.model.js";

//  create new course  :
export const createNewCourse = async (req, res) => {
  try {
    const courseData = req.body;
    const newlyCreatedCourse = new Course(courseData);
    const savedCourse = newlyCreatedCourse.save();

    if (savedCourse) {
      return res.status(200).json({
        success: true,
        message: "course created successfullly!",
        data: savedCourse,
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

// get all course :
export const getAllCourses = async (req, res) => {
  try {
    const coursesList = await Course.find({});

    console.log("course lists :", coursesList);

    return res.status(200).json({
      success: true,
      data: coursesList,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "some error occured!",
    });
  }
};

// get course details by Id :
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

    return res.status(200).json({
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

// update course by Id :
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

    return res.status(200).json({
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
