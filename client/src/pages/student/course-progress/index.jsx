import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { AuthContext } from "@/context/auth-context";
import {
  checkCoursePurchaseService,
  getCurrentCourseProgressService,
  markCurrentLectureAsViewedService,
  resetCurrentCourseProgressService,
} from "@/services";
import { Skeleton } from "@/components/ui/skeleton";
import { StudentContext } from "@/context/student-context";
import { Button } from "@/components/ui/button";
import { Check, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import { Label } from "@radix-ui/react-dropdown-menu";
import Confetti from "react-confetti";
import VideoPlayer from "@/components/video-player";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

const StudentViewCourseProgressPage = () => {
  const { auth } = useContext(AuthContext);
  const { id } = useParams(); // --> current page course id
  const location = useLocation();
  const navigate = useNavigate();
  const { studentCurrentCourseProgress, setStudentCurrentCourseProgress } =
    useContext(StudentContext);
  const [isChecking, setIsChecking] = useState(true);
  const [lockCourse, setLockCourse] = useState(false);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [showCourseCompleteDialog, setShowCourseCompleteDialog] =
    useState(false);
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      if (!id || !auth?.user?._id) {
        navigate(`/course/details/${id}`, {
          replace: true,
        });
        return;
      }

      const purchaseResponse = await checkCoursePurchaseService(
        id,
        auth?.user?._id
      );
      const isPurchased = purchaseResponse?.success && purchaseResponse?.data;

      if (!isPurchased) {
        console.log("Not purchased, redirecting to course details page", id);
        toast.warning("Please purchase the course before accessing it.", {
          position: "top-right",
          autoClose: 3000, // Closes after 3 seconds
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        navigate(`/course/details/${id}`, {
          replace: true,
        });
      } else {
        setIsChecking(false);
      }
    };

    checkAccess();
  }, [id, auth?.user?._id, navigate, location.pathname]);

  async function fetchCurrentCourseProgress() {
    const response = await getCurrentCourseProgressService(auth?.user?._id, id);

    if (response?.success) {
      if (response?.data?.isPurchased) {
        setStudentCurrentCourseProgress({
          courseDetails: response?.data?.courseDetails,
          progress: response?.data?.progress,
        });

        if (response?.data?.completed) {
          setCurrentLecture(response?.data?.courseDetails?.curriculam[0]);
          setShowCourseCompleteDialog(true);
          setShowConfetti(true);
          return;
        }

        if (response?.data?.progress.length === 0) {
          setCurrentLecture(response?.data?.courseDetails?.curriculam[0]);
        } else {
          const lastLectureIndexViewedAsTrue =
            response?.data?.progress.reduceRight((acc, obj, index) => {
              return acc === -1 && obj.viewed ? index : acc;
            }, -1);

          setCurrentLecture(
            response?.data?.courseDetails?.curriculam[
              lastLectureIndexViewedAsTrue + 1
            ]
          );
        }
      }
    }
  }

  async function updateCourseProgress() {
    if (currentLecture) {
      const response = await markCurrentLectureAsViewedService(
        auth?.user?._id,
        studentCurrentCourseProgress?.courseDetails?._id,
        currentLecture?._id
      );

      if (response?.success) {
        fetchCurrentCourseProgress();
      }
    }
  }

  useEffect(() => {
    fetchCurrentCourseProgress();
  }, [id]);

  useEffect(() => {
    if (showConfetti) {
      setTimeout(() => {
        setShowConfetti(false);
      }, 15000);
    }
  }, [showConfetti]);

  useEffect(() => {
    if (currentLecture?.progressValue) {
      updateCourseProgress();
    }
  }, [currentLecture]);

  async function handleRewatchCourse() {
    const response = await resetCurrentCourseProgressService(
      auth?.user?._id,
      studentCurrentCourseProgress?.courseDetails?._id
    );

    if (response?.success) {
      setCurrentLecture(null);
      setShowConfetti(false);
      setShowCourseCompleteDialog(false);
      fetchCurrentCourseProgress();
    }
  }

  if (isChecking) {
    return <Skeleton />;
  }

  return (
    <div className="flex flex-col h-screen bg-[#0f172a] text-white">
      {showConfetti && <Confetti recycle={false} numberOfPieces={500} />}

      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-[#1e293b] border-b border-gray-700">
        <div className="flex items-center space-x-4">
          <Button
            onClick={() => navigate("/student-courses")}
            className="text-white bg-[#3b82f6] hover:bg-[#2563eb] cursor-pointer"
            size={"sm"}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to My Course Page
          </Button>

          <h1 className="text-lg font-bold hidden md:block">
            {studentCurrentCourseProgress?.courseDetails?.title}
          </h1>
        </div>

        <button
          onClick={() => setIsSideBarOpen(!isSideBarOpen)}
          className="rounded-full p-2 text-white font-bold cursor-pointer bg-[#3b82f6] hover:bg-[#2563eb] border-none"
        >
          {isSideBarOpen ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* main content */}
      <div className="flex flex-1 overflow-hidden h-screen">
        <div
          className={`flex-1 ${
            isSideBarOpen ? "mr-[400px]" : ""
          } ease-in transition duration-300`}
        >
          <VideoPlayer
            width="100%"
            height="500px"
            url={currentLecture?.videoUrl}
            onProgressUpdate={setCurrentLecture}
            progressData={currentLecture}
            className="rounded-lg shadow-lg"
          />

          <div className="p-6 bg-[#1e293b]">
            <h2 className="text-2xl font-bold mb-2">{currentLecture?.title}</h2>
            <p className="text-gray-300">{currentLecture?.description}</p>
          </div>
        </div>

        {/* Sidebar */}
        <div
          className={`fixed top-[69px] right-0 bottom-0 w-[400px] bg-[#1e293b] transition-all ease-in ${
            isSideBarOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <Tabs
            defaultValue="content"
            className="h-full flex flex-col border-[0.2px] border-b-white"
          >
            <TabsList className="grid bg-[#1e293b] w-full grid-cols-2 p-0 h-14 ">
              <TabsTrigger
                value="content"
                className="text-white rounded-none border-none h-full hover:bg-[#3b82f6] cursor-pointer "
              >
                Course Content
              </TabsTrigger>
              <TabsTrigger
                value="overview"
                className="text-white rounded-none border-none h-full hover:bg-[#3b82f6] cursor-pointer"
              >
                Overview
              </TabsTrigger>
            </TabsList>

            <TabsContent value="content">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-4">
                  {studentCurrentCourseProgress?.courseDetails?.curriculam.map(
                    (item) => (
                      <div
                        className="flex items-center space-x-2 text-sm text-white font-bold cursor-pointer hover:bg-[#3b82f6] p-2 rounded-lg"
                        key={item._id}
                      >
                        {studentCurrentCourseProgress?.progress?.find(
                          (progressItem) =>
                            progressItem?.lectureId === item?._id
                        )?.viewed ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                        <span>{item?.title}</span>
                      </div>
                    )
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="overview" className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-4">
                  <h2 className="text-xl font-bold mb-4 text-[#0099ff] ">
                    About this course
                  </h2>
                  <hr />
                  <p className="font-normal mt-4 text-start text-[#fffff]">
                    <li>
                      {" "}
                      {studentCurrentCourseProgress?.courseDetails?.description}
                    </li>
                  </p>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Course Completion Dialog */}
      <Dialog open={showCourseCompleteDialog}>
        <DialogContent className="sm:w-[425px]">
          <DialogHeader>
            <DialogTitle>Congratulations!</DialogTitle>
          </DialogHeader>
          <DialogDescription className="flex flex-col gap-3">
            <Label className="text-start">You have completed the course!</Label>
            <div className="flex flex-row gap-3">
              <Button
                className="cursor-pointer bg-[#3b82f6] hover:bg-[#2563eb]"
                onClick={() => navigate("/student-courses")}
              >
                My Course Page
              </Button>
              <Button
                className="cursor-pointer bg-[#3b82f6] hover:bg-[#2563eb]"
                onClick={handleRewatchCourse}
              >
                Rewatch Course
              </Button>
            </div>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentViewCourseProgressPage;
