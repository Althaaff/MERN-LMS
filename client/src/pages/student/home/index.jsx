import { Button } from "@/components/ui/button";
// import { AuthContext } from "@/context/auth-context";
import { useContext, useEffect } from "react";
import banner from "../../../../public/image.png";
import { courseCategories } from "@/config";
import { StudentContext } from "@/context/student-context";
import { fetchStudentViewCourseListService } from "@/services";

const StudentHomePage = () => {
  // const { resetCredential } = useContext(AuthContext);

  const { studentViewCoursesList, setStudentViewCoursesList } =
    useContext(StudentContext);

  console.log("studentViewCoursesList :", studentViewCoursesList);

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
        <h1 className="text-2xl font-bold mb-6">Course Categories</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {courseCategories.map((categoryItem) => (
            <Button
              className="justify-start cursor-pointer"
              variant="outline"
              key={categoryItem.id}
            >
              {categoryItem.label}
            </Button>
          ))}
        </div>{" "}
      </section>

      <section className="py-12 px-4 lg:px-8">
        <h1 className="text-2xl font-bold mb-6">Featured Courses</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {studentViewCoursesList && studentViewCoursesList.length > 0 ? (
            studentViewCoursesList.map((courseItem) => (
              <div
                className="border cursor-pointer shadow overflow-hidden rounded-lg"
                key={courseItem._id}
              >
                <img
                  src={courseItem?.image}
                  alt="course img"
                  width={250}
                  height={150}
                  className="w-full h-40 object-cover"
                />

                <div className="p-4">
                  <h1 className="text-start font-bold mb-2 text-md">
                    {courseItem.title}
                  </h1>

                  <p className="text-sm text-gray-700 mb-2">
                    {courseItem?.instructorName}
                  </p>

                  <p className="font-bold text-[16px]">
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
