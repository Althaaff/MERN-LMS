import { QuizAttempt } from "../../models/quiz.attempt.model.js";

export const getQuizAttemptResults = async (req, res, next) => {
  try {
    const { attemptId } = req.params;

    const quizAttemptResults = await QuizAttempt.findById(attemptId);

    if (!quizAttemptResults) {
      return res.status(404).json({ message: "Quiz attempt not found.." });
    }

    res.status(201).json({
      success: true,
      message: "Quiz attempt result fetched successfully..",
      quizAttemptResults,
    });
  } catch (error) {
    next(error);
  }
};
