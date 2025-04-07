import { QuizAttempt } from "../../models/quiz.attempt.model.js";
import { Quiz } from "../../models/quizz.model.js";

export const submitQuizAttempt = async (req, res, next) => {
  try {
    const { quizId } = req.params;
    const studentId = req.user?._id;
    const { answers } = req.body;

    console.log("answers: ", answers);

    const quiz = await Quiz.findById(quizId);

    console.log("quiz", quiz);

    if (!quiz) {
      return res.status(404).json({
        message: "Quiz not found!",
      });
    }

    let score = 0;
    let evealuatedAnswer = [];

    quiz?.questions?.forEach((q) => {
      console.log("qt", q);
      const selectedIndex = answers[q?._id.toString()];
      console.log("selected index :", selectedIndex);
      const isCorrect = q?.correctAnswerIndex === selectedIndex;

      if (isCorrect) {
        score++;
      }

      evealuatedAnswer.push({
        question: q?._id,
        selectedOptionIndex: selectedIndex,
        isCorrect,
        questionText: q?.question,
        options: q?.options,
        selectedOptionText: q?.options[selectedIndex],
        correctAnswerIndex: q?.correctAnswerIndex,
        correctAnswerText: q?.options[q.correctAnswerIndex],
      });

      console.log("evealuatedAnswer", evealuatedAnswer);
    });

    // attempt :
    const attempt = await QuizAttempt.create({
      student: studentId,
      quiz: quiz?._id,
      course: quiz?.course,
      answers: evealuatedAnswer,
      score,
      totalQuestions: quiz?.questions?.length,
    });

    res.status(201).json({
      success: true,
      attempt,
    });
  } catch (error) {
    next(error);
  }
};
