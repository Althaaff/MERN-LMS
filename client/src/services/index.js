import { axiosInstance } from "@/api/axiosInstance";

async function registerService(formData) {
  const { data } = await axiosInstance.post("/auth/register", {
    ...formData,
    role: "user",
  });

  return data;
}

async function loginService(formData) {
  const { data } = await axiosInstance.post("/auth/login", formData);

  return data;
}

async function checkAuthService() {
  const { data } = await axiosInstance.get("/auth/check-auth");

  return data;
}

// single image & video uplaod :
async function mediaUploadService(formData, onProgressCallback) {
  const { data } = await axiosInstance.post("/media/upload", formData, {
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      onProgressCallback(percentCompleted);
    },
  });

  return data;
}

// bulk media upload : (max : 10)
async function mediaBulkUpload(formData, onProgressCallback) {
  const { data } = await axiosInstance.post("/media/bulk-upload", formData, {
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total // progress percentage calculation //
      );

      onProgressCallback(percentCompleted);
    },
  });

  console.log("bulk api called data :", data);

  return data;
}

// delete file using video public id :
async function mediaDeleteService(id) {
  const { data } = await axiosInstance.delete(`/media/delete/${id}`);
  console.log("delete api data :", data);

  return data;
}

// Instructor View services :

// fetching instructor course list :
async function fetchInstructorCourseListService() {
  const { data } = await axiosInstance.get(`/instructor/course/get`);
  console.log("fetched data :", data);

  return data;
}
// adding new course api service :
async function addNewCourseService(formData) {
  const { data } = await axiosInstance.post(
    `/instructor/course/create`,
    formData
  );

  return data;
}

// fetching instructor course detail by service :
async function fetchInstructorCourseDetailsService(id) {
  const { data } = await axiosInstance.get(
    `/instructor/course/get/details/${id}`
  );

  console.log("update api called :", data);

  return data;
}

// updating course by ID:
async function updateCourseByIdService(id, formData) {
  const { data } = await axiosInstance.put(
    `/instructor/course/update/${id}`,
    formData
  );

  return data;
}

// student View services :

// fetching student view course lists by student query : (student courses):
async function fetchStudentViewCourseListService(query) {
  const { data } = await axiosInstance.get(`/student/course/get?${query}`);

  return data;
}

// fetching student course details service by ID :
async function fetchStudentCourseDetailsService(courseId, studentId) {
  const { data } = await axiosInstance.get(
    `/student/course/get/details/${courseId}/${studentId}`
  );

  return data;
}

// order api service:
export async function createPaymentService(formData) {
  const { data } = await axiosInstance.post(`/student/order/create`, formData);

  return data;
}

export async function captureAndFinalizePaymentService(
  paymentId,
  payerId,
  orderId
) {
  const { data } = await axiosInstance.post(`/student/order/capture`, {
    paymentId,
    payerId,
    orderId,
  });

  console.log("payment data :", data);

  return data;
}

async function fetchStudentBoughtCoursesService(studentId) {
  const { data } = await axiosInstance.get(
    `/student/courses-bought/get/${studentId}`
  );

  return data;
}
// Check if the student has purchased the course
async function checkCoursePurchaseService(courseId, studentId) {
  const { data } = await axiosInstance.get(
    `/student/course/purchase-info/${courseId}/${studentId}`
  );

  return data;
}

// get current student course progress api service :
async function getCurrentCourseProgressService(userId, courseId) {
  const { data } = await axiosInstance.get(
    `/student/course-progress/get/${userId}/${courseId}`
  );

  console.log("working!");

  return data;
}

async function getAllCourseProgressPercentage() {
  const { data } = await axiosInstance.get(
    `/student/course-progress/get/progress-percentage`
  );

  console.log("data :", data);

  console.log("progress percentage Api called!");

  return data;
}

// mark lecture as viewed api service :
async function markCurrentLectureAsViewedService(userId, courseId, lectureId) {
  const { data } = await axiosInstance.post(
    "/student/course-progress/mark-lecture-viewed",
    {
      userId,
      courseId,
      lectureId,
    }
  );

  return data;
}

async function resetCurrentCourseProgressService(userId, courseId) {
  const { data } = await axiosInstance.post(
    "/student/course-progress/reset-progress",
    {
      userId,
      courseId,
    }
  );

  return data;
}

export {
  registerService,
  loginService,
  checkAuthService,
  mediaUploadService,
  mediaDeleteService,
  mediaBulkUpload,
  addNewCourseService,
  updateCourseByIdService,
  fetchInstructorCourseListService,
  fetchInstructorCourseDetailsService,
  fetchStudentViewCourseListService,
  fetchStudentCourseDetailsService,
  fetchStudentBoughtCoursesService,
  checkCoursePurchaseService,
  getCurrentCourseProgressService,
  markCurrentLectureAsViewedService,
  resetCurrentCourseProgressService,
  getAllCourseProgressPercentage,
};
