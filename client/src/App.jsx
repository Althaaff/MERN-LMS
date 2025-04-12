// import "./App.css";

import RouteGuard from "@/components/route-guard";
import StudentViewCommonLayout from "@/components/student-view/Common-layout";
import QuizAttemptResult from "@/components/student-view/QuizAttemptResult";
import QuizForm from "@/components/student-view/QuizForm";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import AuthPage from "@/pages/auth";
import InstructorDashboardPage from "@/pages/instructor";
import AddNewCoursePage from "@/pages/instructor/add-new-course";
import NotFoundPage from "@/pages/not-found";
import StudentViewCourseDetailsPage from "@/pages/student/course-details";
import StudentViewCourseProgressPage from "@/pages/student/course-progress/index";
import StudentViewCoursesPage from "@/pages/student/courses/index";
import StudentHomePage from "@/pages/student/home";
import PayPalPaymentReturnPage from "@/pages/student/payment-return";
import StudentCourses from "@/pages/student/student-courses";
import { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";

function App() {
  const { auth } = useContext(AuthContext);
  const { quiz } = useContext(StudentContext);

  console.log("quiz console", quiz);

  return (
    <>
      <Routes>
        <Route
          path="/auth"
          element={
            <RouteGuard
              element={<AuthPage />}
              authenticated={auth.authenticate}
              user={auth.user}
            />
          }
        />

        <Route
          path="/instructor"
          element={
            <RouteGuard
              element={<InstructorDashboardPage />}
              authenticated={auth?.authenticate}
              user={auth?.user}
            />
          }
        />

        <Route
          path="/instructor/create-new-course"
          element={
            <RouteGuard
              element={<AddNewCoursePage />}
              authenticated={auth?.authenticate}
              user={auth?.user}
            />
          }
        />

        <Route
          path="/instructor/edit-course/:courseId"
          element={
            <RouteGuard
              element={<AddNewCoursePage />}
              authenticated={auth?.authenticate}
              user={auth?.user}
            />
          }
        />

        <Route
          path="/"
          element={
            <RouteGuard
              element={<StudentViewCommonLayout />}
              authenticated={auth?.authenticate}
              user={auth?.user}
            />
          }
        >
          {" "}
          <Route path="" element={<StudentHomePage />} />
          <Route path="/home" element={<StudentHomePage />} />
          <Route path="/courses" element={<StudentViewCoursesPage />} />
          <Route
            path="/course/details/:id"
            element={<StudentViewCourseDetailsPage />}
          />
          <Route path="/payment-return" element={<PayPalPaymentReturnPage />} />
          <Route path="/student-courses" element={<StudentCourses />} />
          <Route
            path="/course-progress/:id"
            element={<StudentViewCourseProgressPage />}
          />
          <Route
            path="/course-progress/quiz/:id"
            element={<QuizForm quiz={quiz} />}
          />
          <Route
            path="/course/:courseId/quiz-result/:attemptId"
            element={<QuizAttemptResult quiz={quiz} />}
          />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        pauseOnHover={true}
      />
    </>
  );
}

export default App;
