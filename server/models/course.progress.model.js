import mongoose, { Schema } from "mongoose";

const LectureProgressSchema = new Schema({
  lectureId: { type: mongoose.Schema.Types.ObjectId, ref: "Lecture" }, // use ObjectId for reference
  viewed: { type: Boolean, default: false },
  dateViewed: { type: Date, default: null },
});

const CourseProgressSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // use ObjectId
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" }, // use ObjectId
  completed: { type: Boolean, default: false },
  completionDate: { type: Date, default: null },
  lecturesProgress: [LectureProgressSchema],
});

const CourseProgress = mongoose.model("CourseProgress", CourseProgressSchema);

export { CourseProgress };
