import { Course } from "../../models/course.model.js";
import { Quiz } from "../../models/quizz.model.js";
import { generateQuestionsWithGemini } from "../../helpers/quizGenerator.js";

export const generateQuizForCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const adminId = req.user?._id;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found!" });
    }

    const questions = await generateQuestionsWithGemini(course?.title);

    const newQuiz = await Quiz.create({
      course: course?._id,
      title: `Quiz for ${course?.title}`,
      questions,
      createdBy: adminId,
    });

    res.status(201).json({
      success: true,
      message: "Quizz created Successfully..",
      quiz: newQuiz,
    });
  } catch (error) {
    console.error("Quiz generation failed:", error);
    res.status(500).json({ message: "Failed to generate quiz" });
  }
};
