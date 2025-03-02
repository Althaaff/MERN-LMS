// import "./App.css";

import RouteGuard from "@/components/route-guard";
import StudentViewCommonLayout from "@/components/student-view/Common-layout";
import { AuthContext } from "@/context/auth-context";
import AuthPage from "@/pages/auth";
import InstructorDashboardPage from "@/pages/instructor";
import AddNewCoursePage from "@/pages/instructor/add-new-course";
import NotFoundPage from "@/pages/not-found";
import StudentViewCourseDetailsPage from "@/pages/student/course-details";
import StudentViewCoursesPage from "@/pages/student/courses/index";
import StudentHomePage from "@/pages/student/home";
import PayPalPaymentReturnPage from "@/pages/student/payment-return";
import StudentCourses from "@/pages/student/student-courses";
import { useContext } from "react";
import { Route, Routes } from "react-router-dom";

function App() {
  const { auth } = useContext(AuthContext);
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
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
