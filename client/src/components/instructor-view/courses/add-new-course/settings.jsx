import MediaProgressBar from "@/components/media-progress-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { InstructorContext } from "@/context/instructor-context";
import { mediaDeleteService, mediaUploadService } from "@/services";
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

    currentImageUploadId,
    setCurrentImageUploadId,
  } = useContext(InstructorContext);

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

        // console.log("public_id :", response?.data.public_id);

        if (response.success) {
          setCourseLandingFormData({
            ...courseLandingFormData,
            image: response.data?.url,
          });
          setMediaUploadProgress(false);
          setCurrentImageUploadId(response?.data.public_id);

          // console.log("course landing img :", courseLandingFormData);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  async function handleReplaceThumbnail() {
    const replaceThumbnailResponse = await mediaDeleteService(
      currentImageUploadId
    );

    if (replaceThumbnailResponse?.success) {
      setCourseLandingFormData((prevData) => {
        const updatedData = { ...prevData, image: "" };
        // console.log("Updated courseLandingFormData:", updatedData);
        return updatedData;
      });
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
          <>
            <img
              className="w-3xl h-[38rem] rounded-md"
              src={courseLandingFormData.image}
            />
            <Button
              onClick={() => handleReplaceThumbnail()}
              className="p-4 bg-black w-auto text-white cursor-pointer mt-3 max-w-[270px]"
            >
              Update Thumbnail
            </Button>
          </>
        ) : (
          <div className="flex flex-col gap-3">
            <Label>Upload Course Image</Label>
            <div className="flex flex-col gap-4">
              <Input
                onChange={handleImageUploadChange}
                type="file"
                accept="image/*"
                className="max-w-[270px]"
              />{" "}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CourseSettings;
