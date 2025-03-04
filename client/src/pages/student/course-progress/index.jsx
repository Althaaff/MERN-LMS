import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { AuthContext } from "@/context/auth-context";
import { checkCoursePurchaseService } from "@/services";
import { Skeleton } from "@/components/ui/skeleton";
import { StudentContext } from "@/context/student-context";

const StudentViewCourseProgressPage = () => {
  const { auth } = useContext(AuthContext);
  const { id } = useParams(); // --> current page id
  const location = useLocation();
  const navigate = useNavigate();
  const { currentCourseDetailsId } = useContext(StudentContext);
  const [isChecking, setIsChecking] = useState(true);

  console.log("currentCourseDetailsId", currentCourseDetailsId);
  console.log("id :", id);

  useEffect(() => {
    const checkAccess = async () => {
      if (!id || !auth?.user?._id) {
        navigate(`/course/details/${id}`, {
          replace: true,
        });
        return;
      }

      const purchaseResponse = await checkCoursePurchaseService(
        id,
        auth?.user?._id
      );
      const isPurchased = purchaseResponse?.success && purchaseResponse?.data;

      if (!isPurchased) {
        console.log("Not purchased, redirecting to course details page", id);
        navigate(`/course/details/${id}`, {
          replace: true,
        });
      } else {
        setIsChecking(false);
      }
    };

    checkAccess();
  }, [id, auth?.user?._id, navigate, location.pathname]);

  if (isChecking) {
    return <Skeleton />;
  }

  return (
    <div>
      <h1>Course Progress Page</h1>
    </div>
  );
};

export default StudentViewCourseProgressPage;
