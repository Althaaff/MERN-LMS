// course routes :

import express from "express";
import {
  createNewCourse,
  getAllCourses,
  getCourseDetailsById,
  updateCourseById,
} from "../../controllers/instructor-controller/course.controller.js";

const router = express.Router();

router.post("/create", createNewCourse);
router.get("/get", getAllCourses);
router.get("/get/details/:id", getCourseDetailsById);
router.put("/update/:id", updateCourseById);

export default router;
