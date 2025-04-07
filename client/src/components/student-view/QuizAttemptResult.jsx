import { getQuizAttemptResultService } from "@/services";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaCheck } from "react-icons/fa";

const QuizAttemptResult = () => {
  const [quizAttemptResult, setQuizAttemptResult] = useState([]);
  const [loading, setLoading] = useState(true);
  const { attemptId } = useParams();

  console.log("ID", attemptId);
  // console.log("quiz id", quiz?._id);

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

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl w-full mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-500 p-6">
            <h2 className="text-2xl md:text-3xl text-green-400 font-bold text-center">
              Your Quiz Results
            </h2>

            <span className="float-right text-1xl md:text-sm text-black font-bold">
              Your Score: {quizAttemptResult?.score} /{" "}
              {quizAttemptResult?.totalQuestions}
            </span>
          </div>
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading quiz questions...</p>
            </div>
          ) : (
            <form className="p-6 md:p-8 space-y-6">
              {quizAttemptResult?.answers?.map((quiz, index) => {
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
                        // console.log("option", option, optionIndex);
                        return (
                          <label
                            key={optionIndex}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200 group"
                          >
                            <input
                              required
                              type="radio"
                              name={`question-${quiz._id}`}
                              value={optionIndex}
                              checked={true}
                              className="w-5 h-5 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                            />
                            <span className="text-gray-700 group-hover:text-gray-900 transition-colors">
                              {<FaCheck />}
                            </span>
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
    </div>
  );
};

export default QuizAttemptResult;
