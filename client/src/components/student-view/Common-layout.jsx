import { Outlet } from "react-router-dom";

const StudentViewCommonLayout = () => {
  return (
    <div>
      Common content
      <Outlet />
    </div>
  );
};

export default StudentViewCommonLayout;
