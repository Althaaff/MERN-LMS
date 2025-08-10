import { Course } from "../../models/course.model.js";
import { Comment } from "../../models/comment.model.js";

//  create new course  :
export const createNewCourse = async (req, res) => {
  try {
    const courseData = req.body;
    const newlyCreatedCourse = new Course(courseData);
    const savedCourse = await newlyCreatedCourse.save();

    if (savedCourse) {
      return res.status(200).json({
        success: true,
        message: "course created successfullly!",
        data: savedCourse,
      });
    }
  } catch (error) {
    console.error(error);

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

    return res.status(200).json({
      success: true,
      data: coursesList,
    });
  } catch (error) {
    console.error(error);

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
    console.error(error);

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
      return res.status(404).json({
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
    console.error(error);

    res.status(500).json({
      success: false,
      message: "some error occured!",
    });
  }
};

// update course by Id :
export const deleteCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCourse = await Course.findByIdAndDelete(id);

    if (!deletedCourse) {
      return res.status(400).json({
        success: false,
        message: "Course not found!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "course deleted successfullly!",
      data: {},
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "some error occured!",
    });
  }
};

export const getAllCourseComments = async (req, res, next) => {
  try {
    const comments = await Comment.find().sort({ createdAt: -1 }); // newest first

    console.log("comments", comments);

    if (comments.length === 0) {
      return next(errorHandler(404, "No comments found!"));
    }

    console.log("allcomments", comments);

    return res.status(200).json({
      success: true,
      message: "All comments fetched successfully",
      comments,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCommentById = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const deletedComment = await Comment.findByIdAndDelete(commentId);

    if (!deletedComment) {
      return res.status(400).json({
        success: false,
        message: "Comment not found!",
      });
    }

    return res.status(201).json({
      success: true,
      message: "student comment deleted successfullly !",
    });
  } catch (error) {
    console.error(error);
  }
};
