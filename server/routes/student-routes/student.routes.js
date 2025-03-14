import express from "express";
import {
  checkCoursePurchaseInfo,
  getAllStudentViewCourses,
  getStudentViewCourseDetails,
  searchCourses,
} from "../../controllers/student-controller/course.controller.js";

const router = express.Router();

router.get("/get", getAllStudentViewCourses);
router.get("/get/details/:id/:studentId", getStudentViewCourseDetails);
router.get("/purchase-info/:id/:studentId", checkCoursePurchaseInfo);
router.get("/search", searchCourses);
export default router;
