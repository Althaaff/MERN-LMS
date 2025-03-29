import { Comment } from "../../models/comment.model.js";

export const createComment = async (req, res, next) => {
  try {
    const { content, courseId, userId } = req.body;

    if (userId !== req.user.id) {
      return "you are not allowed to comment this course..";
    }

    const newComment = new Comment({
      content,
      courseId,
      userId,
    });

    await newComment.save();
    res.status(200).json(newComment);
  } catch (error) {
    console.log(error);
  }
};
