import StudentViewCommonHeader from "@/components/student-view/Header";
import { Outlet } from "react-router-dom";

const StudentViewCommonLayout = () => {
  return (
    <div>
      <StudentViewCommonHeader />
      <Outlet />
    </div>
  );
};

export default StudentViewCommonLayout;
