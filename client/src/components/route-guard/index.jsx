import { Navigate, useLocation } from "react-router-dom";

const RouteGuard = ({ authenticated, user, element }) => {
  // console.log("authenticated or not :", authenticated);
  const location = useLocation();

  // if user is not authenticated then they try to access any other page then redirected to /auth :
  if (!authenticated && !location.pathname.includes("/auth")) {
    return <Navigate to={"/auth"} />;
  }

  // if user is authenticated but user is not an instructor then if user is try's to access the instructor or auth page he redirected to /home page
  if (
    authenticated &&
    user?.role !== "instructor" &&
    (location.pathname.includes("instructor") ||
      location.pathname.includes("auth"))
  ) {
    return <Navigate to={"/home"} />;
  }

  // if user is authenticated then also user is instructor but if user is trys to access any other pages page then he redirect to the /instructor page :
  if (
    authenticated &&
    user?.role === "instructor" &&
    !location.pathname.includes("instructor")
  ) {
    return <Navigate to={"/instructor"} />;
  }

  // if user have valid access then go to the element component :
  return <>{element}</>; //
};

export default RouteGuard;
