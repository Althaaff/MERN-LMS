import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { InstructorContext } from "@/context/instructor-context";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useContext, useRef } from "react";
import {
  mediaBulkUpload,
  mediaDeleteService,
  mediaUploadService,
} from "@/services";
import { courseCurriculumInitialFormData } from "@/config";
import MediaProgressBar from "@/components/media-progress-bar";
import VideoPlayer from "@/components/video-player";
import { Upload } from "lucide-react";

const CourseCurriculam = () => {
  const {
    courseCurriculamFormData,
    setCourseCurriculamFormData,

    mediaUploadProgress,
    setMediaUploadProgress,

    mediaUploadProgressPercentage,
    setMediaUploadProgressPercentage,
  } = useContext(InstructorContext);

  const bulkUploadInputRef = useRef(null);

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
    // console.log(currentValue, currentIndex);

    const copyCurriculamFormData = [...courseCurriculamFormData];
    copyCurriculamFormData[currentIndex] = {
      ...copyCurriculamFormData[currentIndex],
      freePreview: currentValue,
    };

    // console.log("copy:", copyCurriculamFormData);

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

  const handleOpenBulkUpload = async () => {
    bulkUploadInputRef.current.click();
  };

  const handleReplaceVideo = async (currentIndex) => {
    let copyCurriculamFormData = [...courseCurriculamFormData];
    // console.log("copy data", copyCurriculamFormData);

    const getCurrentVideoPublicId =
      copyCurriculamFormData[currentIndex]?.public_id;

    // console.log("id :", getCurrentVideoPublicId);

    const deleteCurrentMediaResponse = await mediaDeleteService(
      getCurrentVideoPublicId
    );

    // console.log("delete media :", deleteCurrentMediaResponse);

    if (deleteCurrentMediaResponse?.success) {
      copyCurriculamFormData[currentIndex] = {
        ...copyCurriculamFormData[currentIndex],
        videoUrl: "",
        public_id: "",
      };

      setCourseCurriculamFormData(copyCurriculamFormData);

      console.log(" state updated :", copyCurriculamFormData);
    }
  };

  // check course curriculam all form data empty ?
  function areAllCourseCurriculumFormDataEmpty(arr) {
    return arr.every((obj) => {
      return Object.entries(obj).every(([key, value]) => {
        console.log("object key :", key);
        // console.log("object value :", value);

        // if value is true or false this not will consider its just ignored :
        if (typeof value === "boolean") {
          return true;
        }
        return value === "";
      });
    });
  }

  // bulk video upload:
  const handleMediaBulkUpload = async (event) => {
    const selectedFiles = Array.from(event.target.files); // Arr.from because we are uploading multiple files //
    const bulkUploadFormData = new FormData();

    console.log("selected multiple files: ", selectedFiles);

    selectedFiles.forEach((fileItem) =>
      bulkUploadFormData.append("files", fileItem)
    );

    try {
      setMediaUploadProgress(true);

      const response = await mediaBulkUpload(
        bulkUploadFormData,
        setMediaUploadProgressPercentage
      );

      console.log("response bulk :", response);

      if (response?.success) {
        let copyCourseCurriculumFormData = areAllCourseCurriculumFormDataEmpty(
          courseCurriculamFormData
        )
          ? []
          : [...courseCurriculamFormData];

        copyCourseCurriculumFormData = [
          ...copyCourseCurriculumFormData,
          ...(Array.isArray(response?.data)
            ? response.data.map((item, index) => ({
                videoUrl: item.url,
                public_id: item.public_id,
                title: `Lecture ${
                  copyCourseCurriculumFormData.length + (index + 1)
                }`,
                freePreview: false,
              }))
            : []),
        ];

        setCourseCurriculamFormData(copyCourseCurriculumFormData);
        setMediaUploadProgress(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // check course curriculam from data is valid if its not valid then disable the Add Lecture Button ?
  function isCourseCurriculamFormDataValid() {
    return courseCurriculamFormData.every((item) => {
      return (
        item &&
        typeof item === "object" &&
        item.title !== "" &&
        item.videoUrl !== ""
      );
    });
  }

  // console.log("after delete :", courseCurriculamFormData);

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <CardTitle className="font-extrabold">
          Create Course Curriculam
        </CardTitle>
        <div>
          <Input
            type="file"
            ref={bulkUploadInputRef}
            accept="video/*"
            multiple
            className="hidden"
            id="bulk-media-upload"
            onChange={handleMediaBulkUpload}
          />

          <Button
            as="label"
            htmlFor="bulk-media-upload"
            variant="outline"
            className="cursor-pointer"
            onClick={handleOpenBulkUpload}
          >
            <Upload className="w-4 h-4 mr-2 " />
            Bulk Upload
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <Button
          disabled={!isCourseCurriculamFormDataValid() || mediaUploadProgress}
          className="cursor-pointer"
          onClick={handleNewLecture}
        >
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
                    <Button
                      className="cursor-pointer"
                      onClick={() => handleReplaceVideo(index)}
                    >
                      Replace Video
                    </Button>
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
