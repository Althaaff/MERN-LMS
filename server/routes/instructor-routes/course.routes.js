// course routes :

import express from "express";
import {
  createNewCourse,
  deleteCourseById,
  getAllComments,
  getAllCourses,
  getCourseDetailsById,
  updateCourseById,
} from "../../controllers/instructor-controller/course.controller.js";
import { getPopularCourses } from "../../controllers/student-controller/course.controller.js";
import { authenticateMiddleware } from "../../middleware/auth-middleware.js";
import { generateQuizForCourse } from "../../controllers/instructor-controller/generateQuizz.controller.js";

const router = express.Router();

router.post("/create", createNewCourse);
router.get("/get", getAllCourses);
router.get("/get/details/:id", getCourseDetailsById);
router.put("/update/:id", updateCourseById);
router.delete("/delete/:id", deleteCourseById);
router.get("/getAllComments", getAllComments);
router.get("/getPopularCourses", getPopularCourses);
router.post(
  "/generate/:courseId",
  authenticateMiddleware,
  generateQuizForCourse
);

export default router;
