import CourseLanding from "@/components/instructor-view/courses/add-new-course/course-landing";
import CourseCurriculam from "@/components/instructor-view/courses/add-new-course/curriculam";
import CourseSettings from "@/components/instructor-view/courses/add-new-course/settings";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";

const AddNewCoursePage = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between">
        <h1 className="text-3xl font-extrabold mb-5">Create a new course</h1>

        <Button className="text-sm font-bold tracking-wider cursor-pointer uppercase">
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
