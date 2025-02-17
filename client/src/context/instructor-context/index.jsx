import {
  courseLandingInitialFormData,
  courseCurriculumInitialFormData,
} from "@/config";
// console.log(courseLandingInitialFormData);
import { createContext, useState } from "react";

export const InstructorContext = createContext();

export default function InstructorProvider({ children }) {
  const [courseLandingFormData, setCourseLandingFormData] = useState(
    courseLandingInitialFormData
  );

  const [courseCurriculamFormData, setCourseCurriculamFormData] = useState(
    courseCurriculumInitialFormData
  );
  // console.log(courseCurriculamFormData);

  const [mediaUploadProgress, setMediaUploadProgress] = useState(false);
  const [mediaUploadProgressPercentage, setMediaUploadProgressPercentage] =
    useState(0);

  return (
    <InstructorContext.Provider
      value={{
        courseLandingFormData,
        setCourseLandingFormData,

        courseCurriculamFormData,
        setCourseCurriculamFormData,

        mediaUploadProgress,
        setMediaUploadProgress,

        mediaUploadProgressPercentage,
        setMediaUploadProgressPercentage,
      }}
    >
      {children}
    </InstructorContext.Provider>
  );
}

// import { courseLandingInitialFormData } from "@/config";
// import { createContext, useEffect, useState } from "react";

// export const InstructorContext = createContext(null);

// export default function InstructorProvider({ children }) {
//   const [courseCurriculamFormData, setCourseCurriculamFormData] = useState(
//     () => {
//       // Get saved data from localStorage on initial load
//       const savedData = localStorage.getItem("courseCurriculam");
//       return savedData ? JSON.parse(savedData) : [];
//     }
//   );

//   const [courseLandingFormData, setCourseLandingFormData] = useState(
//     courseLandingInitialFormData
//   );

//   // Save data to localStorage whenever it changes
//   useEffect(() => {
//     localStorage.setItem(
//       "courseCurriculam",
//       JSON.stringify(courseCurriculamFormData)
//     );
//   }, [courseCurriculamFormData]);

//   return (
//     <InstructorContext.Provider
//       value={{
//         courseLandingFormData,
//         setCourseLandingFormData,
//         courseCurriculamFormData,
//         setCourseCurriculamFormData,
//       }}
//     >
//       {children}
//     </InstructorContext.Provider>
//   );
// }
