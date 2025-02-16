import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { InstructorContext } from "@/context/instructor-context";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useContext } from "react";

const CourseCurriculam = () => {
  const { courseCurriculamFormData, setCourseCurriculamFormData } =
    useContext(InstructorContext);
  console.log(courseCurriculamFormData);

  const handleNewLecture = () => {
    setCourseCurriculamFormData([
      ...courseCurriculamFormData,
      {
        ...courseCurriculamFormData[0],
      },
    ]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-extrabold">
          Create Course Curriculam
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Button className="cursor-pointer" onClick={handleNewLecture}>
          Add Lecture
        </Button>

        <div className="mt-4 space-y-4">
          {courseCurriculamFormData.map((curriculamItem, index) => (
            <div className="border p-5 rounded-md" key={index}>
              <div className="flex flex-col items-start md:flex-row gap-5 md:items-center">
                <h3 className="font-semibold">Lecture {index + 1}</h3>

                <Input
                  name={`title-${index + 1}`}
                  placeholder="Enter lecture title.."
                  className="max-w-96"
                />

                <div className="flex items-center space-x-2">
                  <Switch checked={true} id={`freePreview-${index + 1}`} />

                  <Label htmlFor={`freePreview-${index + 1}`}>
                    Free Preview
                  </Label>
                </div>
              </div>

              <div className="mt-6">
                <Input type="file" accept="video/*" className="mb-4" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseCurriculam;
