import { Course } from "../../models/course.model.js";

export const getAllStudentViewCourses = async (req, res) => {
  // console.log("query :", req.query);
  try {
    const {
      category = [],
      level = [],
      primaryLanguage = [],
      sortBY = "price-lowtohigh",
    } = req.query;

    let filters = {};

    if (category.length) {
      filters.category = { $in: category.split(",") };

      // console.log("filters: ", filters);
    }

    if (level.length) {
      filters.level = { $in: level.split(",") };

      // console.log("filters: ", filters);
    }

    if (primaryLanguage.length) {
      filters.primaryLanguage = { $in: primaryLanguage.split(",") };

      // console.log("filters: ", filters);
    }

    let sortParam = {};

    switch (sortBY) {
      case "price-lowtohigh":
        sortParam.pricing = 1;
        break;

      case "price-hightolow":
        sortParam.pricing = -1;
        break;

      case "title-atoz":
        sortParam.title = 1;
        break;

      case "title-ztoa":
        sortParam.title = -1;
        break;

      default:
        sortParam.pricing = 1;
        break;
    }

    const coursesList = await Course.find(filters).sort(sortParam);

    // this logic is no needed bcoz if in the client side, user selected course is not available then we are showing the course not found :
    // if (coursesList.length === 0) {
    //   return res.status(404).json({
    //     success: false,
    //     message: "No courses found!",
    //     data: [],
    //   });
    // }

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
