import CourseLanding from "@/components/instructor-view/courses/add-new-course/course-landing";
import CourseCurriculam from "@/components/instructor-view/courses/add-new-course/curriculam";
import CourseSettings from "@/components/instructor-view/courses/add-new-course/settings";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  courseCurriculumInitialFormData,
  courseLandingInitialFormData,
} from "@/config";
import { AuthContext } from "@/context/auth-context/index.jsx";
import { InstructorContext } from "@/context/instructor-context";
import {
  addNewCourseService,
  fetchInstructorCourseDetailsService,
  updateCourseByIdService,
} from "@/services";
import { TabsContent } from "@radix-ui/react-tabs";
import { ArrowLeft } from "lucide-react";
import { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const AddNewCoursePage = () => {
  const {
    courseLandingFormData,
    courseCurriculamFormData,
    setCourseLandingFormData,
    setCourseCurriculamFormData,
    currentEditedCourseId,
    setCurrentEditedCourseId,
  } = useContext(InstructorContext);

  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const params = useParams();

  console.log("id :", currentEditedCourseId);

  async function fetchCurrentCourseDetails() {
    const response = await fetchInstructorCourseDetailsService(
      currentEditedCourseId
    );
    // console.log(response.data);

    if (response?.success) {
      const setCourseFormData = Object.keys(
        courseLandingInitialFormData
      ).reduce((acc, key) => {
        acc[key] = response?.data[key] || courseLandingInitialFormData[key];

        return acc;
      }, {});

      console.log("response :", setCourseFormData);
      setCourseLandingFormData(setCourseFormData);
      setCourseCurriculamFormData(response?.data?.curriculam);
    }
  }

  useEffect(() => {
    if (currentEditedCourseId !== null) {
      fetchCurrentCourseDetails();
    }
  }, [currentEditedCourseId]);

  useEffect(() => {
    if (params?.courseId) {
      setCurrentEditedCourseId(params?.courseId);
    }
  }, [params?.courseId]);

  function isEmpty(value) {
    if (Array.isArray(value)) {
      return value.length === 0;
    }

    return value === "" || value === null || value === undefined;
  }

  // validateForm() returns true if the form is valid :
  // !validateForm() to disable the button when the form is invalid :
  function validateForm() {
    for (const key in courseLandingFormData) {
      if (isEmpty(courseLandingFormData[key])) {
        return false;
      }
    }

    let hasFreePreview = false; // intially hasFreePreview false

    for (const item of courseCurriculamFormData) {
      console.log(item);

      // if items are empty then return false
      if (
        isEmpty(item.title) ||
        isEmpty(item.videoUrl) ||
        isEmpty(item.public_id)
      ) {
        return false;
      }

      if (item.freePreview) {
        hasFreePreview = true; //found atleast one free preview //
      }
    }

    return hasFreePreview;
  }

  async function handleCreateCourse() {
    const courseFinalFormData = {
      instructorId: auth?.user?._id,
      instructorName: auth?.user?.userName,
      date: new Date(),
      ...courseLandingFormData,
      students: [], // when creating course intially students should be empty //
      curriculam: courseCurriculamFormData,
      isPublished: true,
    };
    // if current id is not a null then update the course by calling the api updateCourseByIdService otherwise create course :
    const response =
      currentEditedCourseId !== null
        ? await updateCourseByIdService(
            currentEditedCourseId,
            courseFinalFormData
          )
        : await addNewCourseService(courseFinalFormData);

    if (response?.success) {
      setCourseLandingFormData(courseLandingInitialFormData);
      setCourseCurriculamFormData(courseCurriculumInitialFormData);
      navigate(-1);
      setCurrentEditedCourseId(null);
    }
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between">
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => navigate("/instructor")}
            className="p-2 mb-2 rounded-md bg-white border cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className=" font-extrabold mb-3 text-xl md:text-3xl">
            Create a new course
          </h1>
        </div>

        {/* The disabled prop expects true to disable the button.
            The disabled prop expects false to enable the button. */}
        <Button
          disabled={!validateForm()}
          className="text-sm p-4 font-bold tracking-wider cursor-pointer uppercase"
          onClick={handleCreateCourse}
        >
          Submit
        </Button>
      </div>

      <Card>
        <CardContent>
          <div className="container mx-auto">
            <Tabs defaultValue="curriculam" className="space-y-4 py-2 -ml-4">
              <TabsList className="">
                <TabsTrigger className="" value="curriculam">
                  Curriculam
                </TabsTrigger>

                <TabsTrigger className="" value="course-landing-page">
                  Course Landing Page
                </TabsTrigger>

                <TabsTrigger className="" value="settings">
                  Settings
                </TabsTrigger>
              </TabsList>

              <TabsContent value="curriculam">
                <CourseCurriculam />
              </TabsContent>

              <TabsContent value="course-landing-page">
                <CourseLanding />
              </TabsContent>

              <TabsContent value="settings">
                <CourseSettings />
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddNewCoursePage;
