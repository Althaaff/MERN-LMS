import Spinner from "@/components/spinner/Spinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import VideoPlayer from "@/components/video-player";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import {
  checkCoursePurchaseService,
  createPaymentService,
  fetchStudentCourseDetailsService,
} from "@/services";
import { DialogClose } from "@radix-ui/react-dialog";
import { CheckCircle, GlobeIcon, Lock, PlayCircle } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

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

  const navigate = useNavigate();

  const [displayCurrentVideoFreePreview, setDisplayCurrentVideoFreePreview] =
    useState(null);

  const [showFreePreviewDialog, setShowFreePreviewDialog] = useState(false);

  const [clickedVideo, setClickedVideo] = useState(null);

  const [approvalUrl, setApprovalUrl] = useState("");

  const [purchased, setPurchased] = useState(false);

  const [previewCompleted, setPreviewCompleted] = useState(false);

  console.log("previewCompleted: ", previewCompleted);

  // while navigating /course/details flickering issue resolving:
  useEffect(() => {
    if (!location.pathname.includes("/course/details")) {
      setStudentViewCourseDetails(null);
      setCurrentCourseDetailsId(null);
    }
  }, [location.pathname]);

  useEffect(() => {
    const checkAccess = async () => {
      if (!id || !auth.user?._id) {
        return;
      }

      const purchaseResponse = await checkCoursePurchaseService(
        id,
        auth?.user?._id
      );
      const isPurchaseResponseSuccess = purchaseResponse?.success;

      if (isPurchaseResponseSuccess && purchaseResponse?.data) {
        setPurchased(true);
      }
    };

    checkAccess();
  }, [id, navigate, auth?.user?._id]);

  const handleSetFreePreview = (getCurrentVideoInfo) => {
    // console.log("video info :", getCurrentVideoInfo);

    setDisplayCurrentVideoFreePreview(getCurrentVideoInfo?.videoUrl);
  };

  useEffect(() => {
    if (displayCurrentVideoFreePreview !== null) setShowFreePreviewDialog(true);
  }, [displayCurrentVideoFreePreview]);

  useEffect(() => {
    console.log(currentCourseDetailsId === id ? "Yes" : "No");
    if (id) setCurrentCourseDetailsId(id);
  }, [id]);

  useEffect(() => {
    if (id) {
      setStudentViewCourseDetails(null);
      setLoadingState(true);

      const fetchStudentViewCourseDetails = async () => {
        const response = await fetchStudentCourseDetailsService(
          id,
          auth?.user?._id
        );
        if (response.success) {
          setStudentViewCourseDetails(response?.data);

          setLoadingState(false);
        }
      };
      fetchStudentViewCourseDetails();
    }
  }, [id, auth?.user?._id]);

  if (loadingState) {
    console.log("running still..!");
    return <Spinner />;
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
      courseTitle: studentViewCourseDetails?.title,
    };

    const response = await createPaymentService(paymentPayload);

    if (response?.success) {
      sessionStorage.setItem(
        "currentOrderId",
        JSON.stringify(response?.data?.orderId)
      );

      setApprovalUrl(response?.data.approveUrl);
    }
  };

  // Define onProgressUpdate handler (resolved issue):
  const handlePreviewProgressUpdate = (progressData) => {
    // console.log("Free preview progress update:", progressData);
    if (progressData.progressValue === 1) {
      setPreviewCompleted(true);
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
                  onProgressUpdate={handlePreviewProgressUpdate}
                  progressData={{}} // Pass an empty object if progressData isn’t needed
                />
              </div>
              <div className="mb-4">
                <span className="text-2xl font-normal bg-green-200">
                  $ {studentViewCourseDetails?.pricing}
                </span>

                <Button
                  onClick={() => {
                    if (purchased) {
                      navigate(`/course-progress/${id}`); // redirect to course progress
                    } else {
                      handleCreatePayment();
                    }
                  }}
                  className="w-full cursor-pointer mt-4"
                >
                  {purchased ? "Continue Learning" : "Buy Now"}
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

          <div className="aspect-video rounded-md flex flex-col items-center justify-center">
            <VideoPlayer
              url={displayCurrentVideoFreePreview}
              onProgressUpdate={handlePreviewProgressUpdate}
              progressData={{}}
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
