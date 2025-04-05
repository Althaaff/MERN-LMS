import mongoose, { Schema } from "mongoose";

export const questionSchema = new Schema({
  question: String,
  options: [String],
  correctAnswerIndex: Number,
});

export const quizSchema = new Schema(
  {
    course: {
      type: mongoose.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    title: String,
    questions: [questionSchema],
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Quiz = mongoose.model("Quiz", quizSchema);

export { Quiz };
