import mongoose, { Schema } from "mongoose";

const LectureProgressSchema = new Schema({
  lectureId: String,
  viewed: Boolean,
  dateViewed: Date,
});

const CourseProgressSchema = new Schema({
  userId: String,
  courseId: String,
  completed: Boolean,
  completionDate: Date,
  lecturesProgress: [LectureProgressSchema],
});

const CourseProgress = mongoose.model("Progress", CourseProgressSchema);

export { CourseProgress };
