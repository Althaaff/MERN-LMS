import { Button } from "@/components/ui/button";
// import { AuthContext } from "@/context/auth-context";
import { useContext, useEffect, useState } from "react";
import { courseCategories } from "@/config";
import { StudentContext } from "@/context/student-context";
import {
  checkCoursePurchaseService,
  fetchStudentViewCourseListService,
  getPopularCoursesService,
} from "@/services";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "@/context/auth-context";
import Spinner from "@/components/spinner/Spinner";
import ImageSlider from "@/components/Slider";
import { DarkModeContext } from "@/context/darkmode-context";

const StudentHomePage = () => {
  const { studentViewCoursesList, setStudentViewCoursesList } =
    useContext(StudentContext);

  const { auth } = useContext(AuthContext);

  const { darkMode } = useContext(DarkModeContext);

  const navigate = useNavigate();

  const location = useLocation();

  const [loading, setLoading] = useState(false);

  const [popularCourses, setPopularCourses] = useState([]);

  console.log("popular courses", popularCourses);

  async function fetchAllStudentViewCourses() {
    setLoading(true);
    try {
      const response = await fetchStudentViewCourseListService();
      if (response?.success) {
        setStudentViewCoursesList(response?.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAllStudentViewCourses();
  }, []);

  async function fetchPopularCourses() {
    try {
      const response = await getPopularCoursesService();

      if (response?.success) {
        // console.log("response :", response);
        setPopularCourses(response?.courses);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    setTimeout(() => {
      fetchPopularCourses();
    }, 2000);
  }, []);

  if (loading) {
    return <Spinner />;
  }

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
    <div
      className={`min-h-screen ${
        darkMode
          ? "bg-black text-white min-h-screen"
          : "bg-white text-black min-h-screen"
      }`}
    >
      <ImageSlider />
      <section className="py-8 px-4 lg:px-8">
        <h1 className="text-2xl font-normal mb-6">Course Categories</h1>
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

      <section className="py-12 px-4 lg:px-8">
        <h1 className="text-2xl md:pl-20 pl-12 font-normal mb-8 text-left">
          <span className="p-4 border">Featured Courses</span>
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

                <hr className="mt-2 text-white" />

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
            <h1 className="text-black text-2xl flex justify-center items-center">
              Course Not Found!
            </h1>
          )}
        </div>
      </section>

      <section className="py-12 px-4 lg:px-8">
        <h1 className="text-2xl md:pl-20 pl-12 font-normal mb-8 text-left">
          <span className="p-4 border">Popular Courses</span>
        </h1>

        <div className="flex flex-col gap-6 md:flex-row items-center justify-center flex-wrap">
          {popularCourses && popularCourses.length > 0
            ? popularCourses.map((popularCourse) => (
                <div
                  onClick={() => handleCourseNavigate(popularCourse?._id)}
                  className="border w-[314px] h-[337.63px] flex flex-col rounded-md cursor-pointer hover:shadow-xl overflow-hidden transition-transform duration-300 ease-in hover:scale-105"
                  key={popularCourse._id}
                >
                  <div className="flex items-center justify-center mt-2 w-full h-[200px]">
                    <img
                      src={popularCourse?.image}
                      alt="course img"
                      className="object-cover w-[290px] h-[200px] rounded-md"
                    />
                  </div>

                  <hr className="mt-2 text-white" />

                  <div className="p-4 text-left">
                    <h1 className="font-bold mb-2 text-md">
                      {popularCourse.title}
                    </h1>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-700 mb-2">
                        {popularCourse?.instructorName}
                      </p>
                      <a>
                        <a>
                          <i className="fa-solid fa-award text-yellow-500 text-lg"></i>
                        </a>
                      </a>
                    </div>
                    <p className="font-normal text-blue-500 text-[16px]">
                      ${popularCourse?.pricing}
                    </p>
                  </div>
                </div>
              ))
            : null}
        </div>
      </section>
    </div>
  );
};

export default StudentHomePage;
