import { getCourseQuizService, submitQuizAttemptService } from "@/services";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const QuizForm = () => {
  const [quiz, setQuiz] = useState({});
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const { id: courseId } = useParams();
  const navigate = useNavigate();

  // console.log("quiz id", quiz?._id);

  console.log("ID :", courseId);

  useEffect(() => {
    const fetchQuizForCourse = async (courseId) => {
      try {
        setLoading(true);
        const response = await getCourseQuizService(courseId);

        if (response?.success) {
          setQuiz(response?.quiz);
        }
      } catch (error) {
        console.error("error fetching quiz:", error);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchQuizForCourse(courseId);
    }
  }, [courseId]);

  const handleAnswerChange = (questionId, optionIndex) => {
    console.log("question id: ", questionId, optionIndex);
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("submitted answers:", selectedAnswers);

    try {
      const response = await submitQuizAttemptService(
        quiz?._id,
        selectedAnswers
      );

      if (response?.success) {
        console.log(response);

        setTimeout(() => {
          navigate(`/course/${courseId}/quiz-result/${response?.attempt?._id}`);
        }, 2000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl w-full mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-500 p-6">
            <h2 className="text-2xl md:text-3xl text-white font-bold text-center">
              {quiz?.title || "Loading Quiz..."}
            </h2>
            {quiz?.questions && (
              <p className="text-indigo-100 text-center mt-2 text-sm">
                {quiz.questions.length} Questions • Test Your Knowledge
              </p>
            )}
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading quiz questions...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
              {quiz?.questions?.map((q, index) => (
                <div
                  key={q?._id}
                  className="border-b border-gray-200 pb-6 last:border-b-0"
                >
                  <label className="flex items-start gap-3 text-gray-800 font-semibold text-lg mb-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span>{q.question}</span>
                  </label>

                  <div className="space-y-3 pl-11">
                    {q?.options?.map((option, optionIndex) => (
                      <label
                        key={optionIndex}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200 group"
                      >
                        <input
                          required
                          type="radio"
                          name={`question-${q._id}`}
                          value={optionIndex}
                          checked={selectedAnswers[q._id] === optionIndex}
                          onChange={() =>
                            handleAnswerChange(q._id, optionIndex)
                          }
                          className="w-5 h-5 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                        />
                        <span className="text-gray-700 group-hover:text-gray-900 transition-colors">
                          {option}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              {quiz?.questions && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
                  <p className="text-sm text-gray-600">
                    Progress: {Object.keys(selectedAnswers).length} /{" "}
                    {quiz.questions.length}
                  </p>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300 transition-colors duration-200 font-medium shadow-md"
                  >
                    Submit Quiz
                  </button>
                </div>
              )}
            </form>
          )}

          {!loading && (
            <div className="bg-gray-50 px-6 py-4 text-center text-sm text-gray-500 border-t">
              Select one answer per question • Progress saves automatically
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizForm;
