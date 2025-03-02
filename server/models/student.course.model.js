import mongoose, { Schema } from "mongoose";

const StudentCourseSchema = new Schema({
  userId: String,

  courses: [
    {
      courseId: String,
      instructorId: String,
      title: String,
      instructorName: String,
      dateOfPurchase: Date,
      courseImage: String,
    },
  ],
});

const StudentCourses = mongoose.model("StudentCourses", StudentCourseSchema);

export { StudentCourses };
