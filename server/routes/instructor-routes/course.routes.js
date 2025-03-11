// course routes :

import express from "express";
import {
  createNewCourse,
  deleteCourseById,
  getAllCourses,
  getCourseDetailsById,
  updateCourseById,
} from "../../controllers/instructor-controller/course.controller.js";

const router = express.Router();

router.post("/create", createNewCourse);
router.get("/get", getAllCourses);
router.get("/get/details/:id", getCourseDetailsById);
router.put("/update/:id", updateCourseById);
router.delete("/delete/:id", deleteCourseById);

export default router;
