import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes/index.js";
import mediaRoutes from "./routes/instructor-routes/upload.routes.js";
import istructorCourseRoutes from "./routes/instructor-routes/course.routes.js";
import studentViewCourseRoutes from "./routes/student-routes/student.routes.js";
import studentViewOrderRoutes from "./routes/student-routes/order.routes.js";
import studentCoursesRoutes from "./routes/student-routes/student-courses.routes.js";
import studentCoursesProgressRoutes from "./routes/student-routes/course-progress.routes.js";
import studentCourseCommentRoutes from "./routes/student-routes/comment.routes.js";

const app = express();
const PORT = process.env.PORT || 6000;

const MONGO_URI = process.env.MONGO_URI;

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// database connection :
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("mongo db is connected!"))
  .catch((error) => console.log(error));

// routes configuration :
app.use("/auth", authRoutes);

// upload media routes :
app.use("/media", mediaRoutes);

// course routes :
app.use("/instructor/course", istructorCourseRoutes);

// student view course routes:
app.use("/student/course", studentViewCourseRoutes);

// order :
app.use("/student/order", studentViewOrderRoutes);

// review of course :
app.use("/student/course-review", studentCourseCommentRoutes);

// student bought courses  :
app.use("/student/courses-bought", studentCoursesRoutes);

// course progress :
app.use("/student/course-progress", studentCoursesProgressRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error!";

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
