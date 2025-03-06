import express from "express";

import { getCoursesByStudentId } from "../../controllers/student-controller/student-courses.controller.js";

const router = express.Router();

router.route("/get/:studentId").get(getCoursesByStudentId);

export default router;
