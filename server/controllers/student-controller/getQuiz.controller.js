import { Quiz } from "../../models/quizz.model.js";

export const getQuizForCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    console.log("courseId", courseId);

    const quiz = await Quiz.findOne({ course: courseId });

    if (!quiz) {
      return res
        .status(404)
        .json({ success: false, message: "Quiz not found" });
    }

    res.status(201).json({
      success: true,
      quiz,
    });
  } catch (error) {
    next(error);
  }
};
