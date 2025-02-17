import FormControls from "@/components/common-form/Form-controls";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { courseLandingPageFormControls } from "@/config";
console.log("form controls: ", courseLandingPageFormControls);
import { InstructorContext } from "@/context/instructor-context";
import { useContext } from "react";

const CourseLanding = () => {
  const { courseLandingFormData, setCourseLandingFormData } =
    useContext(InstructorContext);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Landing Page</CardTitle>
      </CardHeader>

      <CardContent>
        <FormControls
          formControls={courseLandingPageFormControls}
          formData={courseLandingFormData}
          setFormData={setCourseLandingFormData}
        ></FormControls>
      </CardContent>
    </Card>
  );
};

export default CourseLanding;
