import MediaProgressBar from "@/components/media-progress-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { InstructorContext } from "@/context/instructor-context";
import { mediaUploadService } from "@/services";
import { Label } from "@radix-ui/react-dropdown-menu";
import { useContext } from "react";

const CourseSettings = () => {
  const {
    courseLandingFormData,
    setCourseLandingFormData,

    mediaUploadProgress,
    setMediaUploadProgress,

    mediaUploadProgressPercentage,
    setMediaUploadProgressPercentage,
  } = useContext(InstructorContext);

  console.log(courseLandingFormData);

  async function handleImageUploadChange(event) {
    const selectedImage = event.target.files[0];

    if (selectedImage) {
      let imageFormData = new FormData();

      imageFormData.append("file", selectedImage);

      try {
        setMediaUploadProgress(true);
        let response = await mediaUploadService(
          imageFormData,
          setMediaUploadProgressPercentage
        );

        // console.log(response);

        if (response.success) {
          setCourseLandingFormData({
            ...courseLandingFormData,
            image: response.data?.url,
          });
          setMediaUploadProgress(false);

          // console.log("course landing img :", courseLandingFormData);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Settings</CardTitle>
      </CardHeader>

      <div className="p-2">
        {mediaUploadProgress ? (
          <MediaProgressBar
            isMediaUploading={mediaUploadProgress}
            progress={mediaUploadProgressPercentage}
          />
        ) : null}
      </div>

      <CardContent>
        {courseLandingFormData?.image ? (
          <img src={courseLandingFormData.image} />
        ) : (
          <div className="flex flex-col gap-3">
            <Label>Upload Course Image</Label>
            <Input
              onChange={handleImageUploadChange}
              type="file"
              accept="image/*"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CourseSettings;
