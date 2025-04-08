import { getQuizAttemptResultService } from "@/services";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaCheck } from "react-icons/fa";

const QuizAttemptResult = () => {
  const [quizAttemptResult, setQuizAttemptResult] = useState([]);
  const [loading, setLoading] = useState(true);
  const { courseId, attemptId } = useParams();
  const navigate = useNavigate();

  console.log("ID", attemptId);

  console.log("quiz results:", quizAttemptResult);

  useEffect(() => {
    const fetchQuizAttemptResult = async (attemptId) => {
      try {
        setLoading(true);
        const response = await getQuizAttemptResultService(attemptId);

        if (response?.success) {
          console.log("response", response);
          setQuizAttemptResult(response?.quizAttemptResults);
        }
      } catch (error) {
        console.error("error fetching quiz:", error);
      } finally {
        setLoading(false);
      }
    };

    if (attemptId) {
      fetchQuizAttemptResult(attemptId);
    }
  }, [attemptId]);

  const percentage =
    (quizAttemptResult?.score / quizAttemptResult?.totalQuestions) * 100;

  console.log("percentage", quizAttemptResult?.totalQuestions);

  const isQuizPassed = percentage >= 70;

  console.log("passed ?", isQuizPassed);

  return (
    <>
      <div className="relative min-h-screen bg-gray-50 py-12 px-4 flex flex-col gap-2 items-center justify-center">
        <div className="absolute top-4 left-4 z-10">
          <span
            onClick={() => navigate(`/course-progress/quiz/${courseId}`)}
            className="bg-white border p-4 rounded-full hover:bg-gray-100 transition-all duration-300 cursor-pointer flex items-center justify-center"
          >
            <FaArrowLeft color="blue" size={16} />
          </span>
        </div>

        <div className="max-w-3xl w-full mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-blue-500 p-6">
              <h2 className="text-2xl md:text-3xl text-green-400 font-bold text-center">
                Your Quiz Results
              </h2>

              <div className="float-right text-1xl md:text-sm text-black font-bold">
                Your Score: {quizAttemptResult?.score} /{" "}
                {quizAttemptResult?.totalQuestions}
              </div>
            </div>
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading quiz questions...</p>
              </div>
            ) : (
              <form className="p-6 md:p-8 space-y-6">
                {quizAttemptResult?.answers?.map((quiz, index) => {
                  // console.log("quiz", quiz);
                  return (
                    <div
                      key={quiz?._id}
                      className="border-b border-gray-200 pb-6 last:border-b-0"
                    >
                      <label className="flex items-start gap-3 text-gray-800 font-semibold text-lg mb-3">
                        <span className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center">
                          {index + 1}
                        </span>
                        <span>{quiz?.questionText}</span>
                      </label>

                      <div className="space-y-3 pl-11">
                        {quiz?.options?.map((option, optionIndex) => {
                          console.log("optionIndex", optionIndex);
                          const isSelected =
                            optionIndex === quiz?.selectedOptionIndex;

                          console.log("selected", isSelected);

                          const isCorrectAnswer =
                            optionIndex === quiz?.correctAnswerIndex;

                          let bgColor = "";

                          if (quiz?.isCorrect && isSelected) {
                            bgColor =
                              "bg-green-100 text-green-700 border-green-500";
                          } else if (!quiz?.isCorrect && isSelected) {
                            bgColor = "bg-red-100 text-red-700 border-red-500";
                          } else if (!quiz?.isCorrect && isCorrectAnswer) {
                            bgColor =
                              "bg-green-100 text-green-600 border-green-400"; // correct answer (if not selected)
                          }

                          // console.log("option", option, optionIndex);
                          return (
                            <label
                              key={optionIndex}
                              className={`flex items-center gap-3 p-2 rounded-lg border ${bgColor} hover:bg-gray-50 cursor-pointer transition-colors duration-200 group`}
                            >
                              <input
                                required
                                type="radio"
                                name={`question-${quiz._id}`}
                                value={optionIndex}
                                checked={isSelected}
                                disabled
                                className="w-5 h-5 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                              />
                              <span className="text-gray-700 group-hover:text-gray-900 transition-colors">
                                {option}
                              </span>

                              {!quiz?.isCorrect && isCorrectAnswer && (
                                <span className="bg-green-200 rounded-full p-2">
                                  <FaCheck
                                    color="green"
                                    className="font-bold"
                                  />
                                </span>
                              )}
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </form>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center text-center gap-4 p-6 w-[782px] mb-2 bg-white shadow-md rounded-xl border">
          <h2
            className={`text-xl font-bold ${
              isQuizPassed ? "text-green-600" : "text-red-500"
            }`}
          >
            {isQuizPassed
              ? "🎉 Congratulations! You passed the quiz!"
              : "😔 Oops! You didn’t pass."}
          </h2>

          <p className="text-gray-700">
            {isQuizPassed
              ? "You’ve demonstrated strong understanding of the course material."
              : "You can review the course again and give it another shot!"}
          </p>

          <button
            onClick={() =>
              isQuizPassed
                ? navigate(`/course-progress/${courseId}`)
                : navigate(`/course-progress/quiz/${courseId}`)
            }
            className={`px-6 py-2 rounded-lg font-semibold cursor-pointer shadow-md transition ${
              isQuizPassed
                ? "bg-green-500 hover:bg-green-600 text-white"
                : "bg-yellow-400 hover:bg-yellow-500 text-black"
            }`}
          >
            {isQuizPassed ? "✅ Finish Course" : "🔁 Try Again"}
          </button>
        </div>
      </div>
    </>
  );
};

export default QuizAttemptResult;
