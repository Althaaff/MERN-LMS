import { CourseProgress } from "../../models/course.progress.model.js";
import { Course } from "../../models/course.model.js";
import { StudentCourses } from "../../models/student.course.model.js";
import mongoose from "mongoose";

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
        course?.curriculam?.length &&
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
    console.log("courseId: ", courseId);
    if (!userId || !courseId) {
      return res.status(400).json({
        success: false,
        message: "User ID and Course ID are required!",
      });
    }

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

    // get the course :
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "course not found!",
      });
    }

    const userCourseProgress = await CourseProgress.findOne({
      userId,
      courseId,
    });

    // Get user's course progress
    if (
      !userCourseProgress ||
      userCourseProgress.lecturesProgress.length === 0
    ) {
      return res.status(200).json({
        success: true,
        message: "No progress found, you can start watching the course",
        data: {
          courseDetails: course,
          progress: [], // keep empty array //
          // progressPercentage: 0, // no progress initially //
          isPurchased: true,
        },
      });
    }

    const courseDetails = await Course.findById(courseId);

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        progress: userCourseProgress.lecturesProgress,
        completed: userCourseProgress.completed,
        completionDate: userCourseProgress.completionDate,
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

// get progress bar percentage based course lecture views :
export const getAllCourseProgressPercentage = async (req, res) => {
  const userId = req.user?._id;
  console.log("User:", req.user);

  if (!userId) {
    return res.status(404).json({
      success: false,
      message: "User ID is required!",
    });
  }

  // Fetch user's purchased courses
  const studentPurchasedCourses = await StudentCourses.findOne({ userId });

  if (!studentPurchasedCourses) {
    return res.status(200).json({
      success: true,
      message: "Please purchase a course before accessing it.",
      data: [],
    });
  }

  // Fetch all purchased courses
  const purchasedCourseIds = studentPurchasedCourses.courses.map(
    (item) => item.courseId
  );

  // Fetch course progress for the user's purchased courses
  const userProgressList = await CourseProgress.find({
    userId: new mongoose.Types.ObjectId(userId),
    courseId: { $in: purchasedCourseIds },
  });

  console.log("User progress list:", userProgressList);

  // Fetch total lectures for each purchased course
  const allCourses = await Course.find({ _id: { $in: purchasedCourseIds } });

  const progressData = allCourses.map((course) => {
    const userCourseProgress = userProgressList.find((progress) =>
      progress?.courseId.equals(course?._id)
    );

    const totalLectures = course?.curriculam?.length || 0;
    const viewedLectures =
      userCourseProgress?.lecturesProgress?.filter(
        (lecture) => lecture?.viewed === true
      ).length || 0;

    const progressPercentage =
      totalLectures > 0
        ? Math.round((viewedLectures / totalLectures) * 100)
        : 0;

    return {
      courseId: course._id,
      progressPercentage,
    };
  });

  console.log("Progress Data:", progressData);

  return res.status(200).json({
    success: true,
    purchased: true, // Explicitly returning purchased status
    data: progressData,
  });
};

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
