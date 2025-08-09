import express from "express";
import { authenticateMiddleware } from "../../middleware/auth-middleware.js";
import {
  createComment,
  deleteComment,
  editComment,
  getAllComments,
  getCourseComments,
} from "../../controllers/student-controller/comment.controller.js";

const router = express.Router();

router.post("/create-comment", authenticateMiddleware, createComment);
router.get("/getCourseComments/:courseId", getCourseComments);
router.get("/getAllCourseComments", getAllComments);
router.put("/editComment/:commentId", authenticateMiddleware, editComment);
router.delete(
  "/deleteComment/:commentId",
  authenticateMiddleware,
  deleteComment
);

export default router;
