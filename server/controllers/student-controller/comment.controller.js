import { Comment } from "../../models/comment.model.js";
import { errorHandler } from "../../utils/errorHandler.js";

export const createComment = async (req, res, next) => {
  try {
    const { content, courseId, userId } = req.body;
    console.log("content", content, courseId, userId);

    if (userId !== req.user?._id) {
      return "you are not allowed to comment this course..";
    }

    const newComment = new Comment({
      content,
      courseId,
      userId,
    });

    await newComment.save();
    res.status(201).json({
      success: true,
      message: "Comment created successfully.",
      comment: newComment,
    });
  } catch (error) {
    next(error);
  }
};

export const editComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    console.log("comment", comment);

    if (!comment) {
      return next(errorHandler(404, "Comment not found!"));
    }

    if (comment.userId !== req.user?._id) {
      console.log("TRUE");
      return next(
        errorHandler(403, "You are not allowed to edit this comment!")
      );
    }

    if (!req.body.content || req.body.content.trim() === "") {
      return next(errorHandler(400, "Comment content cannot be empty"));
    }

    comment.content = req.body.content;
    const updatedComment = await comment.save();

    return res.status(200).json({
      success: true,
      message: "Comment updated successfully",
      comment: updatedComment,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    console.log("comment id", req.params.commentId);
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return next(errorHandler(404, "Comment not found!"));
    }

    if (
      comment.userId.toString() !== req.user?._id.toString() &&
      req.role !== "instructor"
    ) {
      console.log(
        "users",
        comment.userId.toString(),
        "logged in user:",
        req.user?._id.toString()
      );
      return next(
        errorHandler(403, "You are not allowed delete this comment!")
      );
    }

    await Comment.findByIdAndDelete(req.params.commentId);
    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getCourseComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ courseId: req.params.courseId });

    if (comments.length === 0) {
      return next(errorHandler(404, "comments not found!"));
    }

    return res.status(201).json({
      success: true,
      message: "comments are fetched successfully..",
      comments,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllComments = async (req, res, next) => {
  try {
    const comments = await Comment.find().sort({ createdAt: -1 }); // newest first

    if (comments.length === 0) {
      return next(errorHandler(404, "No comments found!"));
    }

    console.log("allcomments", comments);

    return res.status(200).json({
      success: true,
      message: "All comments fetched successfully",
      comments,
    });
  } catch (error) {
    next(error);
  }
};
