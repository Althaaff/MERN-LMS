import { Button } from "@/components/ui/button";
// import { AuthContext } from "@/context/auth-context";
import { useContext, useEffect } from "react";
import banner from "../../../../public/image.png";
import { courseCategories } from "@/config";
import { StudentContext } from "@/context/student-context";
import {
  checkCoursePurchaseService,
  fetchStudentViewCourseListService,
} from "@/services";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "@/context/auth-context";

const StudentHomePage = () => {
  // const { resetCredential } = useContext(AuthContext);

  const { studentViewCoursesList, setStudentViewCoursesList } =
    useContext(StudentContext);

  const { auth } = useContext(AuthContext);

  const navigate = useNavigate();

  const location = useLocation();

  async function fetchAllStudentViewCourses() {
    const response = await fetchStudentViewCourseListService();

    console.log("student courses :", response.data);

    if (response?.success) {
      setStudentViewCoursesList(response?.data);
    }
  }

  useEffect(() => {
    fetchAllStudentViewCourses();
  }, []);

  async function handleCourseNavigate(getCurrentCourseId) {
    let targetRoute = `/course-progress/${getCurrentCourseId}`;

    try {
      checkCoursePurchaseService(getCurrentCourseId, auth?.user?._id)
        .then((response) => {
          if (!response?.success || !response?.data) {
            // If not purchased navigate to the course details page :
            navigate(`/course/details/${getCurrentCourseId}`, {
              replace: true,
            });
          } else {
            navigate(targetRoute);
          }
        })
        .catch((error) => {
          console.error("Error fetching purchase info:", error);
        });
    } catch (error) {
      console.error("Navigation failed:", error);
    }
  }

  function handleNavigateToCoursesPage(getCurrentCategoryItemId) {
    console.log("categoryItem :", getCurrentCategoryItemId);

    const currentFilter = {
      category: [getCurrentCategoryItemId],
    };
    // Save to sessionStorage as a fallback
    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    // Navigate with the filter state directly
    navigate("/courses", { state: { filters: currentFilter } });

    if (location.pathname.includes("/courses")) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <section className="flex flex-col lg:flex-row items-center justify-between py-8 px-4 lg:px-8">
        <div className="lg:w-1/2 lg:pr-12">
          <h1 className="text-5xl lg:text-5xl font-bold text-gray-900 leading-tight">
            Welcome to Your Learning Journey!
          </h1>

          <p className="text-xl">
            Skills for your present and future. Get Started with US
          </p>
        </div>

        <div className="lg:w-full mb-8 lg:mb-0">
          <img
            src={banner}
            width={600}
            height={600}
            className="w-full h-auto shadow-lg"
            alt=""
          />
        </div>
      </section>

      <section className="py-8 px-4 lg:px-8 bg-gray-100">
        <h1 className="text-2xl font-normal text-black mb-6">
          Course Categories
        </h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {courseCategories.map((categoryItem) => (
            <Button
              className="justify-start w-full text-lg font-medium cursor-pointer text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 ease-in rounded-lg px-4 py-2 shadow-md"
              key={categoryItem.id}
              onClick={() => handleNavigateToCoursesPage(categoryItem.id)}
            >
              {categoryItem.label}
            </Button>
          ))}
        </div>{" "}
      </section>

      <section className="py-12 px-4 lg:px-8 bg-gray-100">
        <h1 className="text-2xl text-black font-normal pl-20 mb-8 text-left">
          Featured Courses
        </h1>

        <div className="flex flex-col gap-6 md:flex-row items-center justify-center flex-wrap">
          {studentViewCoursesList && studentViewCoursesList.length > 0 ? (
            studentViewCoursesList.map((courseItem) => (
              <div
                onClick={() => handleCourseNavigate(courseItem?._id)}
                className="border w-[314px] h-[337.63px] flex flex-col rounded-md cursor-pointer hover:shadow-xl overflow-hidden transition-transform duration-300 ease-in hover:scale-105"
                key={courseItem._id}
              >
                <div className="flex items-center justify-center mt-2 w-full h-[200px]">
                  <img
                    src={courseItem?.image}
                    alt="course img"
                    className="object-cover w-[290px] h-[200px] rounded-md"
                  />
                </div>

                <hr className="mt-2" />

                <div className="p-4 text-left">
                  <h1 className="font-bold mb-2 text-md">{courseItem.title}</h1>
                  <p className="text-sm text-gray-700 mb-2">
                    {courseItem?.instructorName}
                  </p>
                  <p className="font-normal text-blue-500 text-[16px]">
                    ${courseItem?.pricing}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <h1 className="">Courses not found!</h1>
          )}
        </div>
      </section>
    </div>
  );
};

export default StudentHomePage;
