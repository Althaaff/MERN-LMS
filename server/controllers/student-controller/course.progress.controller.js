import { CourseProgress } from "../../models/course.progress.model.js";
import { Course } from "../../models/course.model.js";
import { StudentCourses } from "../../models/student.course.model.js";

// mark current course as viewed :
export const markCurrentLectureAsViewed = async (req, res) => {
  try {
    const { userId, courseId, lectureId } = req.body;

    let userCourseProgress = await CourseProgress.findOne({ userId, courseId });

    if (!userCourseProgress) {
      userCourseProgress = new CourseProgress({
        userId,
        courseId,

        lecturesProgress: [
          {
            lectureId,
            viewed: true,
            dateViewed: new Date(),
          },
        ],
      });
      await userCourseProgress.save();
    } else {
      const lectureProgress = userCourseProgress.lecturesProgress.find(
        (item) => item.lectureId === lectureId
      );
      // track the last watched again:
      if (lectureProgress) {
        lectureProgress.viewed = true;
        lectureProgress.dateViewed = new Date();
      } else {
        // watching lecture is new lectureId means same course another lecture :
        userCourseProgress.lecturesProgress.push({
          lectureId,
          viewed: true,
          dateViewed: new Date(),
        });
      }

      await userCourseProgress.save();
    }

    // find the course by couse Id :
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // check all the lectures are view or not :
    const allLecturesViewed =
      userCourseProgress?.lecturesProgress?.length ===
        course.curriculam.length &&
      userCourseProgress?.lecturesProgress?.every((item) => item.viewed);

    if (allLecturesViewed) {
      userCourseProgress.completed = true;
      userCourseProgress.completionDate = new Date();

      await userCourseProgress.save();
    }
    res.status(200).json({
      success: true,
      message: "Lecture marked as viewed !",
      data: userCourseProgress,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

//  get currrent course progress :
export const getCurrentCourseProgress = async (req, res) => {
  try {
    const { userId, courseId } = req.params;

    const studentPurchasedCourses = await StudentCourses.findOne({ userId });

    const isCurrentCourseStudentPurchased =
      studentPurchasedCourses?.courses.findIndex(
        (item) => item.courseId === courseId
      ) > -1;

    if (!isCurrentCourseStudentPurchased) {
      return res.status(200).json({
        success: true,
        data: { isPurchased: false },
        message: "you need to purchase this course before access it!",
      });
    }

    const currentUserCourseProgress = await CourseProgress.findOne({
      userId,
      courseId,
    });

    console.log("progress consoled :", currentUserCourseProgress);

    if (
      !currentUserCourseProgress ||
      currentUserCourseProgress?.lecturesProgress?.length === 0
    ) {
      const course = await Course.findById(courseId);

      if (!course) {
        return res.status(404).json({
          success: false,
          message: "Course not found!",
        });
      }

      return res.status(200).json({
        success: true,
        message: "No progress found, you can start watching the course",
        data: {
          courseDetails: course,
          progress: [],
          isPurchased: true,
        },
      });
    }

    const courseDetails = await Course.findById(courseId);

    res.status(200).json({
      success: true,
      data: {
        courseDetails,
        progress: currentUserCourseProgress.lecturesProgress,
        completed: currentUserCourseProgress.completed,
        completionDate: currentUserCourseProgress.completionDate,
        isPurchased: true,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

// reset course progress :
export const resetCurrentCourseProgress = async (req, res) => {
  try {
    const { userId, courseId } = req.body;

    const userCourseProgress = await CourseProgress.findOne({
      userId,
      courseId,
    });

    if (!userCourseProgress) {
      return res.status(404).json({
        success: false,
        message: "course progress not found!",
      });
    }

    userCourseProgress.lecturesProgress = [];
    userCourseProgress.completed = false;
    userCourseProgress.completionDate = null;

    await userCourseProgress.save();

    return res.status(200).json({
      success: true,
      message: "course progress has been reset!",
      data: userCourseProgress,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};
