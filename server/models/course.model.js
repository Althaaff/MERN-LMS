// course model :

import mongoose, { Schema } from "mongoose";

const lectureSchema = new Schema({
  title: String,
  public_id: String,
  videoUrl: String,
  freePreview: Boolean,
});

const courseSchema = new Schema(
  {
    instructorId: String,
    courseId: String,
    instructorName: String,
    date: Date,
    title: String,
    category: String,
    level: String,
    primaryLanguage: String,
    language: String,
    subtitle: String,
    description: String,
    image: String,
    welcomeMessage: String,
    pricing: Number,
    objectives: String,

    students: [
      {
        studentId: String,
        studentName: String,
        studentEmail: String,
        paidAmount: String,
      },
    ],

    curriculam: [lectureSchema],
    isPublished: Boolean,
  },
  { timestamps: true }
);

const Course = mongoose.model("Course", courseSchema);

export { Course };
