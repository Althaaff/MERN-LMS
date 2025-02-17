import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { InstructorContext } from "@/context/instructor-context";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useContext } from "react";
import { mediaUploadService } from "@/services";
import { courseCurriculumInitialFormData } from "@/config";
import MediaProgressBar from "@/components/media-progress-bar";
import VideoPlayer from "@/components/video-player";

const CourseCurriculam = () => {
  const {
    courseCurriculamFormData,
    setCourseCurriculamFormData,

    mediaUploadProgress,
    setMediaUploadProgress,

    mediaUploadProgressPercentage,
    setMediaUploadProgressPercentage,
  } = useContext(InstructorContext);
  console.log(courseCurriculamFormData);

  const handleNewLecture = () => {
    setCourseCurriculamFormData([
      ...courseCurriculamFormData,
      {
        ...courseCurriculumInitialFormData[0],
      },
    ]);
  };

  // specific index title changing :
  const handleCourseTitleChange = (event, currentIndex) => {
    let copyCurriculamFormData = [...courseCurriculamFormData];
    copyCurriculamFormData[currentIndex] = {
      ...copyCurriculamFormData[currentIndex],
      title: event.target.value,
    };
    setCourseCurriculamFormData(copyCurriculamFormData);

    // console.log(copyCurriculamFormData[currentIndex]);
  };

  const handleFreePreviewChange = (currentValue, currentIndex) => {
    console.log(currentValue, currentIndex);

    const copyCurriculamFormData = [...courseCurriculamFormData];
    copyCurriculamFormData[currentIndex] = {
      ...copyCurriculamFormData[currentIndex],
      freePreview: currentValue,
    };

    console.log("copy:", copyCurriculamFormData);

    setCourseCurriculamFormData(copyCurriculamFormData);
  };

  const handleSingleLectureUpload = async (event, currentIndex) => {
    // console.log("file changing :", event.target.files);
    const selectedVideoFile = event.target.files[0];
    if (selectedVideoFile) {
      const videoFormData = new FormData();
      videoFormData.append("file", selectedVideoFile);

      try {
        setMediaUploadProgress(true);

        const response = await mediaUploadService(
          videoFormData,
          setMediaUploadProgressPercentage
        );

        if (response.success) {
          let copyCurriculamFormData = [...courseCurriculamFormData];
          copyCurriculamFormData[currentIndex] = {
            ...copyCurriculamFormData[currentIndex],
            videoUrl: response?.data?.url,
            public_id: response?.data?.public_id,
          };

          setCourseCurriculamFormData(copyCurriculamFormData);
          setMediaUploadProgress(false);
        }

        // console.log("media response: ", response);
      } catch (error) {
        console.log(error);
      }
    }
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

        {mediaUploadProgress ? (
          <MediaProgressBar
            isMediaUploading={mediaUploadProgress}
            progress={mediaUploadProgressPercentage}
          />
        ) : null}

        <div className="mt-4 space-y-4">
          {courseCurriculamFormData.map((curriculamItem, index) => (
            <div className="border p-5 rounded-md" key={index}>
              <div className="flex flex-col items-start md:flex-row gap-5 md:items-center">
                <h3 className="font-semibold">Lecture {index + 1}</h3>

                <Input
                  name={`title-${index + 1}`}
                  placeholder="Enter lecture title.."
                  className="max-w-96"
                  onChange={(event) => handleCourseTitleChange(event, index)}
                  value={courseCurriculamFormData[index]?.title}
                />

                <div className="flex items-center space-x-2">
                  <Switch
                    onCheckedChange={(value) =>
                      handleFreePreviewChange(value, index)
                    }
                    checked={courseCurriculamFormData[index]?.freePreview}
                    id={`freePreview-${index + 1}`}
                  />

                  <Label htmlFor={`freePreview-${index + 1}`}>
                    Free Preview
                  </Label>
                </div>
              </div>

              <div className="mt-6">
                {courseCurriculamFormData[index].videoUrl ? (
                  <div className="flex gap-5">
                    <VideoPlayer
                      width="450px"
                      height="200px"
                      url={courseCurriculamFormData[index].videoUrl}
                    />
                    <Button>Replace Video</Button>
                    <Button className="bg-red-900">Delete Lecture</Button>
                  </div>
                ) : (
                  <Input
                    type="file"
                    accept="video/*"
                    onChange={(event) =>
                      handleSingleLectureUpload(event, index)
                    }
                    className="mb-4"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseCurriculam;
