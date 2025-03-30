import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { AuthContext } from "@/context/auth-context";
import { FaCommentAlt } from "react-icons/fa";
import {
  checkCoursePurchaseService,
  createCommentService,
  getAllCommentsService,
  getCurrentCourseProgressService,
  markCurrentLectureAsViewedService,
  resetCurrentCourseProgressService,
} from "@/services";
import { Skeleton } from "@/components/ui/skeleton";
import { StudentContext } from "@/context/student-context";
import { Button } from "@/components/ui/button";
import { Check, ChevronLeft, ChevronRight, Lock, Play } from "lucide-react";
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
import Spinner from "@/components/spinner/Spinner";
// import CommentAndDescriptionTabs from "@/components/student-view/Tabs";
import { motion, AnimatePresence } from "framer-motion";

const StudentViewCourseProgressPage = () => {
  const { auth } = useContext(AuthContext);
  const { loadingState, setLoadingState } = useContext(StudentContext);
  const { id } = useParams(); // --> current page course id
  const location = useLocation();
  const navigate = useNavigate();
  const { studentCurrentCourseProgress, setStudentCurrentCourseProgress } =
    useContext(StudentContext);

  console.log("auth", auth?.user?._id);
  const [isChecking, setIsChecking] = useState(true);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [showCourseCompleteDialog, setShowCourseCompleteDialog] =
    useState(false);
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [status, setStatus] = useState(null);
  // const { studentViewCourseDetails } = useContext(StudentContext);
  const [activeTab, setActiveTab] = useState("description");
  const [showModal, setShowModal] = useState(false);

  // console.log("student view course", studentViewCourseDetails);
  // console.log("coursedetails", studentViewCourseDetails);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  console.log("comments", comments);

  // console.log("comment", comment);

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

  // fetch current course progress :
  async function fetchCurrentCourseProgress() {
    try {
      const response = await getCurrentCourseProgressService(
        auth?.user?._id,
        id
      );

      if (response?.success) {
        if (response?.data?.isPurchased) {
          setStudentCurrentCourseProgress({
            courseDetails: response?.data?.courseDetails,
            progress: response?.data?.progress,
          });

          if (response?.data?.completed) {
            console.log("All lectures completed!");
            setCurrentLecture(response?.data?.courseDetails?.curriculam[0]);
            setShowCourseCompleteDialog(true);
            setShowConfetti(true);
            return;
          }

          const lastLectureIndexViewed = response?.data?.progress.reduceRight(
            (acc, obj, index) => (acc === -1 && obj.viewed ? index : acc),
            -1
          );

          // unlock only the next lecture if the first lecture is viewed :
          const nextLectureIndex = lastLectureIndexViewed + 1;
          console.log("This is the next lecture:", nextLectureIndex);
          setCurrentLecture(
            response?.data?.courseDetails?.curriculam[nextLectureIndex] || null
          );
        }
      }
    } catch (error) {
      console.error("Error fetching course progress:", error);

      if (error.response) {
        const status = error.response.status;
        if (status === 404) {
          setStatus(404);
        } else if (status === 400) {
          toast.error("User ID and Course ID are required!");
        } else {
          toast.error("Something went wrong. Please try again later.");
        }
      } else if (error.request) {
        // no response was received
        toast.error("No response from the server. Please try again.");
      } else {
        // other errors
        toast.error("Network error! Please check your connection.");
      }
    } finally {
      setLoadingState(false);
    }
  }

  // update course progress :
  async function updateCourseProgress() {
    if (currentLecture) {
      const response = await markCurrentLectureAsViewedService(
        auth?.user?._id,
        studentCurrentCourseProgress?.courseDetails?._id,
        currentLecture?._id
      );

      if (response?.success) {
        await fetchCurrentCourseProgress(); // refetch progress after marking lecture as viewed //
      }
    }
  }

  // // comment of the course :
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await createCommentService(comment, id, auth?.user?._id);

      if (response?.success) {
        setComment("");
        setComments([response?.comment, ...comments]);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    async function fetchCourseComments() {
      const response = await getAllCommentsService(id);

      if (response.success) {
        setComments(response?.comments);
      }
    }

    fetchCourseComments();
  }, [id]);

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

  if (loadingState) {
    return <Spinner />;
  }
  function handleTabClick(tab) {
    setActiveTab(tab);

    if (tab === "comments") {
      requestAnimationFrame(() => setShowModal(true));
    }
  }

  return (
    <div className="flex flex-col h-screen w-screen  bg-[#0f172a] text-white">
      {showConfetti && <Confetti recycle={false} numberOfPieces={500} />}

      {status === 404 ? (
        <div className="sticky inset-0 h-screen flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md z-50">
          <div className="bg-[#1e293b] text-white p-6 rounded-lg shadow-lg text-center w-96">
            <h2 className="text-xl font-bold mb-2">Course Not Available</h2>
            <p className="text-gray-300 mb-4">
              This course is no longer available.
            </p>
            <Button
              onClick={() => navigate("/student-courses")}
              className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-6 py-4 rounded-lg cursor-pointer"
            >
              Go Back
            </Button>
          </div>
        </div>
      ) : (
        <>
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
                <h2 className="text-2xl font-bold mb-2">
                  {currentLecture?.title}
                </h2>
              </div>
              {/* <div className="p-4 bg-black rounded-md border mt-2">
                <li className="text-red-400 ">
                  {studentViewCourseDetails?.objectives}
                </li>
              </div> */}
              {/* <CommentAndDescriptionTabs /> */}
              <div className="w-full mx-auto p-4 text-black rounded-lg shadow-md">
                <div className="flex space-x-15 mb-4">
                  <Button
                    className="cursor-pointer"
                    variant={
                      activeTab === "description" ? "default" : "outline"
                    }
                    onClick={() => handleTabClick("description")}
                  >
                    Description
                  </Button>

                  <Button
                    className="cursor-pointer"
                    variant={activeTab === "comments" ? "default" : "outline"}
                    onClick={() => handleTabClick("comments")}
                  >
                    Comments
                  </Button>
                </div>

                <div className=" overflow-hidden">
                  <AnimatePresence mode="wait">
                    {activeTab === "description" && (
                      <motion.div
                        key="description"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                        className="absolute w-full"
                      >
                        <p className="text-sm">
                          This is the description content.
                        </p>
                      </motion.div>
                    )}
                    {activeTab === "comments" && (
                      <motion.div
                        key="comments"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="absolute w-full"
                      >
                        {/* {showModal && (
                          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md z-50">
                            <div className=" p-6 rounded-lg shadow-lg w-96 relative">
                              <button
                                className="absolute top-2 right-3 text-gray-600 hover:text-gray-800"
                                onClick={() => setShowModal(false)}
                              >
                                ✖
                              </button>

                              <div className="flex flex-col items-start">
                                <div className="flex items-center gap-2 bg-blue-500 p-4 w-full ">
                                  <span className="text-md font-normal">
                                    <FaCommentAlt color="black" />
                                  </span>
                                  <h2 className="text-white font-normal">
                                    Add Review...
                                  </h2>
                                </div>
                                <div className="flex justify-between items-center">
                                  <form onSubmit={handleSubmit}>
                                    <input
                                      type="text"
                                      className="border-none outline-none p-4 mt-4 w-full mx-auto"
                                      placeholder="Write a review..."
                                      value={comment}
                                      onChange={(e) =>
                                        setComment(e.target.value)
                                      }
                                    />
                                    <button className="py-2 px-3 rounded-md bg-blue-500 hover:bg-blue-400 transition-all text-white font-bold cursor-pointer">
                                      {" "}
                                      Send{" "}
                                    </button>
                                  </form>
                                </div>
                                <div className="flex flex-col gap-3 items-center rounded-md bg-gray-900 p-3 w-full h-104 overflow-y-auto scrollbar-hide">
                                  {comments?.map((comment) => {
                                    console.log("mapped comments", comment);
                                    return (
                                      <>
                                        <div
                                          key={comment?.courseId}
                                          className="p-7 rounded-md bg-gray-700 w-full"
                                        >
                                          <span className="text-white font-normal">
                                            {comment?.content}
                                          </span>
                                        </div>
                                      </>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>
                        )} */}

                        {showModal && (
                          <div
                            key={showModal}
                            className="fixed inset-0 flex items-center justify-center backdrop-blur-lg z-50 w-full"
                          >
                            {/* Modal Box */}
                            <div className="bg-gray-800 p-6 rounded-2xl shadow-xl w-[800px] relative">
                              {/* Close Button */}
                              <button
                                className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-xl cursor-pointer"
                                onClick={() => setShowModal(false)}
                              >
                                ✖
                              </button>

                              {/* Header */}
                              <div className="flex items-center gap-3 border-b pb-3">
                                <FaCommentAlt className="text-blue-500 text-xl" />
                                <h2 className="text-lg font-semibold text-white">
                                  Add Review
                                </h2>
                              </div>

                              {/* Input Field */}
                              <form onSubmit={handleSubmit} className="mt-4">
                                <input
                                  type="text"
                                  className="w-full border rounded-md p-3 focus:ring-2 focus:ring-blue-400 text-white"
                                  placeholder="Write a review..."
                                  value={comment}
                                  onChange={(e) => setComment(e.target.value)}
                                />
                                <button
                                  type="submit"
                                  className="w-full mt-3 py-2 bg-blue-500 text-white  cursor-pointer rounded-lg font-semibold hover:bg-blue-600 transition-all"
                                >
                                  Send
                                </button>
                              </form>

                              {/* Comments List */}
                              <div className="mt-5 max-h-40 overflow-y-auto scrollbar-hide">
                                {comments.length === 0 ? (
                                  <p className="text-gray-500 text-center">
                                    No comments yet.
                                  </p>
                                ) : (
                                  comments.map((comment) => (
                                    <div
                                      key={comment.courseId}
                                      className="p-3 rounded-md mt-2"
                                    >
                                      <div className="flex items-center gap-3">
                                        <span className="text-white text-[19px]">
                                          {comment.content}
                                        </span>
                                        <button
                                          className=" px-1 shadow-lg bg-white text-red-400 font-bold
                                         rounded-md cursor-pointer"
                                        >
                                          Edit
                                        </button>

                                        <button className=" px-1 shadow-lg bg-white text-blue-400 font-bold rounded-md cursor-pointer">
                                          Delete
                                        </button>
                                      </div>
                                    </div>
                                  ))
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

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
                        (item, index) => {
                          const isViewed =
                            studentCurrentCourseProgress?.progress?.some(
                              (progressItem) =>
                                progressItem?.lectureId === item?._id &&
                                progressItem.viewed
                            );

                          // lock if previous lecture is not viewed:
                          const isLocked =
                            index > 0 &&
                            !studentCurrentCourseProgress?.progress[index - 1]
                              ?.viewed;

                          console.log("isLocked :", isLocked);

                          return (
                            <div
                              key={item._id}
                              className={`flex items-center space-x-2 text-sm font-bold p-2 rounded-lg 
                         ${
                           isLocked
                             ? "text-gray-500 cursor-not-allowed"
                             : "text-white cursor-pointer hover:bg-[#3b82f6]"
                         }`}
                              onClick={() =>
                                !isLocked && setCurrentLecture(item)
                              }
                            >
                              {isViewed ? (
                                <Check className="w-4 h-4 text-green-500" />
                              ) : isLocked ? (
                                <Lock className="w-4 h-4 text-gray-500" />
                              ) : (
                                <Play className="w-4 h-4" />
                              )}
                              <span>{item?.title}</span>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent
                  value="overview"
                  className="flex-1 overflow-hidden"
                >
                  <ScrollArea className="h-full">
                    <div className="p-4">
                      <h2 className="text-xl font-bold mb-4 text-[#0099ff] ">
                        About this course
                      </h2>
                      <hr />
                      <div className="bg-black text-white rounded-md p-4 mt-2 border">
                        <p className="font-normal mt-4 text-start text-[#fffff]">
                          <li>
                            {" "}
                            {
                              studentCurrentCourseProgress?.courseDetails
                                ?.description
                            }
                          </li>
                        </p>
                      </div>
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          <Dialog open={showCourseCompleteDialog}>
            <DialogContent showOverlay={false} className="sm:w-[425px]">
              <DialogHeader>
                <DialogTitle>Congratulations!</DialogTitle>
              </DialogHeader>
              <DialogDescription className="flex flex-col gap-3">
                <Label className="text-start">
                  You have completed the course!
                </Label>
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
        </>
      )}
    </div>
  );
};

export default StudentViewCourseProgressPage;
