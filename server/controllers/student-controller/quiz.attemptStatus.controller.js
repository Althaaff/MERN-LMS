import { QuizAttempt } from "../../models/quiz.attempt.model.js";
import { Quiz } from "../../models/quizz.model.js";

export const quizAttemptStatus = async (req, res, next) => {
  try {
    const { quizId } = req.params;
    const { studentId } = req.query;

    if (!quizId || !studentId) {
      return res.status(400).json({
        success: false,
        message: "Both quizId and studentId are required",
      });
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    // find latest attempt
    const attempt = await QuizAttempt.findOne({
      quiz: quizId,
      student: studentId,
    }).sort({ _id: -1 });

    // If no attempt exists
    if (!attempt) {
      return res.status(200).json({
        success: true,
        attempted: false,
        message: "No attempt found for this quiz by the student",
      });
    }

    // If attempt is marked as not attempted
    if (!attempt.attempted) {
      return res.status(200).json({
        success: true,
        attempted: false,
        attemptId: attempt._id,
        isPassed: false,
        percentage: "0.00",
        score: 0,
      });
    }

    // Calculate results for active attempt
    const score = attempt.score;
    const totalQuestions = attempt.totalQuestions;
    const percentage = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0;
    const isPassed = percentage >= 70;

    // Update attempt with new values
    const updatedAttempt = await QuizAttempt.findByIdAndUpdate(
      attempt._id,
      {
        isPassed,
        percentage,
      },
      { new: true, select: "attempted isPassed percentage score" }
    );

    // Send response with only required fields
    return res.status(200).json({
      success: true,
      message: "quiz attempt checked successfully!",
      attempted: updatedAttempt.attempted, // Should be true for active attempts
      attemptId: attempt._id,
      isPassed: updatedAttempt.isPassed,
      percentage: updatedAttempt.percentage.toFixed(2),
      score: updatedAttempt.score,
    });
  } catch (error) {
    console.error("Failed to check quiz attempt status:", error);
    next(error);
  }
};

export const resetAttemptStatus = async (req, res, next) => {
  try {
    const { attemptId } = req.params;

    // update attempt with reset values
    const resetAttempt = await QuizAttempt.findByIdAndUpdate(
      attemptId,
      {
        attempted: false,
        score: 0,
        isPassed: false,
        percentage: 0,
      },
      { new: true, select: "attempted score isPassed percentage" }
    );
    console.log("reset attempt", resetAttempt);
    if (!resetAttempt) {
      return res.status(404).json({
        success: false,
        message: "Quiz Attempt Status Not Found!",
      });
    }

    return res.status(200).json({
      success: true,
      attempted: resetAttempt.attempted,
      score: resetAttempt.score,
      isPassed: resetAttempt.isPassed,
      percentage: resetAttempt.percentage,
      message: "Quiz Attempt Status Updated!",
    });
  } catch (error) {
    console.error("Failed to reset quiz attempt status:", error);
    next(error);
  }
};
