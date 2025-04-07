import express from "express";
import {
  getCurrentCourseProgress,
  markCurrentLectureAsViewed,
  resetCurrentCourseProgress,
  getAllCourseProgressPercentage,
} from "../../controllers/student-controller/course.progress.controller.js";
import { authenticateMiddleware } from "../../middleware/auth-middleware.js";
import { getQuizForCourse } from "../../controllers/student-controller/getQuiz.controller.js";
import { submitQuizAttempt } from "../../controllers/student-controller/submitQuiz.controller.js";
import { getQuizAttemptResults } from "../../controllers/student-controller/getQuizAttempt.controller.js";

const router = express.Router();

router.get("/get/:userId/:courseId", getCurrentCourseProgress);
router.post("/mark-lecture-viewed", markCurrentLectureAsViewed);
router.post("/reset-progress", resetCurrentCourseProgress);
router.get(
  "/get/progress-percentage",
  authenticateMiddleware,
  getAllCourseProgressPercentage
);
router.get("/:courseId/getQuiz", authenticateMiddleware, getQuizForCourse);
router.post("/attempt/:quizId", authenticateMiddleware, submitQuizAttempt);
router.get("/getAttemptResults/:attemptId", getQuizAttemptResults);

export default router;
