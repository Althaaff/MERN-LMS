import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import VideoPlayer from "@/components/video-player";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import {
  createPaymentService,
  fetchStudentCourseDetailsService,
} from "@/services";
import { DialogClose } from "@radix-ui/react-dialog";
import { CheckCircle, GlobeIcon, Lock, PlayCircle } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

const StudentViewCourseDetailsPage = () => {
  const {
    studentViewCourseDetails,
    setStudentViewCourseDetails,
    currentCourseDetailsId,
    setCurrentCourseDetailsId,
    loadingState,
    setLoadingState,
  } = useContext(StudentContext);

  const { auth } = useContext(AuthContext);
  const { id } = useParams();

  const location = useLocation();

  console.log("location :", location.pathname);

  const [displayCurrentVideoFreePreview, setDisplayCurrentVideoFreePreview] =
    useState(null);
  const [showFreePreviewDialog, setShowFreePreviewDialog] = useState(false);

  const [clickedVideo, setClickedVideo] = useState(null);

  const [approvalUrl, setApprovalUrl] = useState("");

  // while navigating /course/details flickering issue resolving:
  useEffect(() => {
    if (!location.pathname.includes("/course/details")) {
      setStudentViewCourseDetails(null);
      setCurrentCourseDetailsId(null);
    }
  }, [location.pathname]);

  const handleSetFreePreview = (getCurrentVideoInfo) => {
    console.log("video info :", getCurrentVideoInfo);

    setDisplayCurrentVideoFreePreview(getCurrentVideoInfo?.videoUrl);
  };

  useEffect(() => {
    if (displayCurrentVideoFreePreview !== null) setShowFreePreviewDialog(true);
  }, [displayCurrentVideoFreePreview]);

  const fetchStudentCourseDetails = async () => {
    const response = await fetchStudentCourseDetailsService(
      currentCourseDetailsId
    );

    if (response?.success) {
      setStudentViewCourseDetails(response?.data);

      setLoadingState(false);
    } else {
      setStudentViewCourseDetails(null);

      setLoadingState(false);
    }
  };

  // console.log(id);

  useEffect(() => {
    if (currentCourseDetailsId !== null) {
      fetchStudentCourseDetails();
    }
  }, [currentCourseDetailsId]);

  useEffect(() => {
    if (id) {
      setCurrentCourseDetailsId(id);
    }
  }, [id]);

  if (loadingState) {
    return <Skeleton />;
  }

  if (approvalUrl !== "") {
    window.location.href = approvalUrl;
  }

  // which video freePreview true :
  const getIndexOfFreePreviewUrl =
    studentViewCourseDetails !== null
      ? studentViewCourseDetails.curriculam?.findIndex(
          (item) => item.freePreview
        )
      : null;

  console.log(
    "index of free preview and that video url :",
    getIndexOfFreePreviewUrl,
    studentViewCourseDetails?.curriculam[getIndexOfFreePreviewUrl]?.videoUrl
  );

  const handleCreatePayment = async () => {
    const paymentPayload = {
      userId: auth?.user._id,
      userName: auth?.user.userName,
      userEmail: auth?.user.userEmail,
      orderStatus: "pending",
      paymentMethod: "paypal",
      paymentStatus: "initiated",
      orderDate: new Date(),
      paymentId: "",
      payerId: "",
      instructorId: studentViewCourseDetails?.instructorId,
      instructorName: studentViewCourseDetails?.instructorName,
      courseImage: studentViewCourseDetails?.image,
      courseId: studentViewCourseDetails?._id,
      coursePricing: studentViewCourseDetails?.pricing,
    };

    console.log("payment payload :", paymentPayload);

    const response = await createPaymentService(paymentPayload);

    if (response?.success) {
      console.log("payment res", response);
      sessionStorage.setItem(
        "currentOrderId",
        JSON.stringify(response?.data?.orderId)
      );

      setApprovalUrl(response?.data.approveUrl);
    }
  };

  return (
    <div className="mx-auto p-4">
      <div className="bg-gray-900 text-white p-8 rounded-t-lg">
        <h1 className="text-3xl font-bold mb-4">
          {studentViewCourseDetails?.title}
        </h1>
        <p className="text-xl font-bold mb-4">
          {studentViewCourseDetails?.subtitle}
        </p>

        <div className="flex items-center space-x-4 mt-2 text-sm">
          <span>Created by {studentViewCourseDetails?.instructorName}</span>
          <span>Created by {studentViewCourseDetails?.date.split("T")[0]}</span>

          <span className="flex items-center ">
            <GlobeIcon className="w-4 h-4 mr-1" />
            {studentViewCourseDetails?.primaryLanguage}
          </span>

          <span className="">
            {studentViewCourseDetails?.students.length}{" "}
            {studentViewCourseDetails?.students.length <= 1
              ? "Student"
              : "Students"}
          </span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 mt-8">
        <main className="flex-grow">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="font-extrabold">
                What you'll learn 💡
              </CardTitle>
            </CardHeader>

            <CardContent>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {studentViewCourseDetails?.objectives
                  .split(",")
                  .map((objective, index) => (
                    <li key={index} className="flex items-start ">
                      <CheckCircle className="mr-2 h-5 w-5 text-green-500 flex-shrink" />

                      <span className="font-normal">{objective}</span>
                    </li>
                  ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Course Description</CardTitle>
            </CardHeader>
            <CardContent>{studentViewCourseDetails?.description}</CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Course Curriculum</CardTitle>
            </CardHeader>

            <CardContent>
              {studentViewCourseDetails?.curriculam?.map(
                (curriculamItem, index) => {
                  return (
                    <>
                      <li
                        key={index}
                        className={`${
                          curriculamItem?.freePreview
                            ? "cursor-pointer text-[16px] font-bold p-3 bg-[#0059ff] rounded-md text-white hover:bg-[#0077ff] transition-all ease-in w-auto"
                            : "cursor-not-allowed list-none text-[16px] font-bold p-3 bg-[#0059ff] rounded-md text-white hover:bg-[#0077ff] transition-all ease-in w-auto"
                        } flex items-center mb-4`}
                        onClick={
                          curriculamItem?.freePreview
                            ? () => {
                                handleSetFreePreview(curriculamItem);
                                setClickedVideo(curriculamItem?.title);
                              }
                            : null
                        }
                      >
                        {curriculamItem?.freePreview ? (
                          <PlayCircle className="mr-2 w-6 h-6 text-green-400" />
                        ) : (
                          <Lock className="mr-2 w-6 h-6 text-green-400" />
                        )}

                        <span className="">{curriculamItem?.title}</span>
                      </li>
                    </>
                  );
                }
              )}
            </CardContent>
          </Card>
        </main>

        <aside className="w-full md:w-[500px] border rounded-md">
          <div className="sticky top-2">
            <CardContent className="p-6">
              <div className="aspect-video mb-4 rounded-lg flex items-center justify-center">
                <VideoPlayer
                  url={
                    getIndexOfFreePreviewUrl !== -1
                      ? studentViewCourseDetails?.curriculam[
                          getIndexOfFreePreviewUrl
                        ]?.videoUrl
                      : ""
                  }
                  width="480px"
                  height="240px"
                />
              </div>
              <div className="mb-4">
                <span className="text-2xl font-normal bg-green-200">
                  $ {studentViewCourseDetails?.pricing}
                </span>

                <Button
                  onClick={handleCreatePayment}
                  className="w-full cursor-pointer mt-4"
                >
                  Buy Now
                </Button>
              </div>
            </CardContent>
          </div>
        </aside>
      </div>

      <Dialog
        open={showFreePreviewDialog}
        onOpenChange={() => {
          setShowFreePreviewDialog(false);
          setDisplayCurrentVideoFreePreview(null);
        }}
      >
        <DialogContent className="w-[600px] pl-2 p-4">
          <DialogHeader>
            <DialogTitle>Course Preview</DialogTitle>
          </DialogHeader>

          <div className="aspect-video rounded-lg flex items-center justify-center">
            <VideoPlayer
              url={displayCurrentVideoFreePreview}
              width="480px"
              height="240px"
            />
          </div>

          <div className="flex flex-wrap items-center float-right gap-2 cursor-pointer">
            {studentViewCourseDetails?.curriculam
              .filter((item) => item?.freePreview)
              .filter(
                (clickedVideoTitle) => clickedVideoTitle?.title !== clickedVideo
              )
              .map((filterItem, index) => {
                console.log("free :", filterItem);
                return (
                  <span
                    className="cursor-pointer text-[16px] font-bold p-3 bg-[#0059ff] rounded-md w-auto text-white hover:bg-[#0077ff] transition-all ease-in"
                    key={index}
                    onClick={() => handleSetFreePreview(filterItem)}
                  >
                    {filterItem?.title}
                  </span>
                );
              })}
          </div>

          <DialogFooter className="sm:justify-start">
            <DialogClose asChilde>
              <button
                type="button"
                className="cursor-pointer
                bg-black
                text-white
                p-2 text-sm hover:bg-black rounded-md"
              >
                Close
              </button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentViewCourseDetailsPage;
