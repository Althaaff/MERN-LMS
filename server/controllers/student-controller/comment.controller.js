import { Comment } from "../../models/comment.model.js";
import { errorHandler } from "../../utils/errorHandler.js";

export const createComment = async (req, res, next) => {
  console.log(req?.user?._id);
  try {
    const { content, courseId, userId } = req.body;

    console.log("content", content);
    console.log("course Id", courseId);
    console.log("userId", userId);

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

    if (comment.length === 0) {
      return next(errorHandler(404, "Comment not found!"));
    }

    const editedComment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      {
        content: req.body.content,
      },
      {
        new: true,
      }
    );

    res.status(200).json({
      success: true,
      mesage: "review updated successfully..",
      comment: editedComment,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (comment.length === 0) {
      return next(errorHandler(404, "Comment not found!"));
    }

    if (comment.userId !== req.user?._id && !req.role === "instructor") {
      return next(
        errorHandler(403, "You are not allowed delete this comment!")
      );
    }

    await Comment.findByIdAndDelete(req.params.commentId);
    res.status(200).json({
      success: true,
      message: "comment has been deleted successfully..",
    });
  } catch (error) {
    next(error);
  }
};

export const getCourseComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ courseId: req.params.courseId });
    console.log("all comments", comments);

    if (comments.length === 0) {
      return next(errorHandler(404, "comments not found!"));
    }

    res.status(201).json({
      success: true,
      message: "comments are fetched successfully..",
      comments,
    });
  } catch (error) {
    next(error);
  }
};
