import mongoose, { Schema } from "mongoose";

export const quizAttemptSchema = new Schema(
  {
    student: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    quiz: {
      type: mongoose.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
    course: {
      type: mongoose.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    answers: [
      {
        question: {
          type: String,
          required: true,
        },
        selectedOptionIndex: {
          type: Number,
          required: true,
        },
        isCorrect: {
          type: Boolean,
          required: true,
        },
        questionText: {
          type: String,
        },
        options: {
          type: [String], // Array of strings for options
        },
        selectedOptionText: {
          type: String,
        },
        correctAnswerIndex: {
          type: Number,
        },
        correctAnswerText: {
          type: String,
        },
      },
    ],

    score: {
      type: Number,
      required: true,
    },

    totalQuestions: {
      type: Number,
      required: true,
    },
    attemptedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const QuizAttempt = mongoose.model("QuizAttempt", quizAttemptSchema);

export { QuizAttempt };
