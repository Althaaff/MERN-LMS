import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSwipeable } from "react-swipeable";

const ImageSlider = () => {
  // Array of image URLs (you can replace these with your own image URLs)
  const images = [
    "https://img-c.udemycdn.com/notices/web_carousel_slide/image/10ca89f6-811b-400e-983b-32c5cd76725a.jpg", // Placeholder image 1
    "https://img.freepik.com/free-vector/hand-drawn-web-developers_23-2148819604.jpg", // Placeholder image 2
    "https://goedu.ac/wp-content/uploads/2020/12/Getting-Started-with-C-Programming-Language-Course-Image-GoEdu.jpg", // Placeholder image 3
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null);
  const navigate = useNavigate();

  // Function to start or reset the auto-slide interval
  const startAutoSlide = () => {
    // // run if intervalRed is not null :
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      nextSlide();
    }, 5000);
  };

  // Function to reset the auto-slide timer
  const resetAutoSlide = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    startAutoSlide();
  };

  // Set up auto-slide on mount and reset on update
  useEffect(() => {
    startAutoSlide();

    // when component mounts clear the interval auto sliding timings //
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Function to go to the previous image
  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  // Function to go to the next image
  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Swipe handlers using react-swipeable
  const handlers = useSwipeable({
    onSwipedLeft: () => nextSlide(), // Swipe left to go to the next image
    onSwipedRight: () => prevSlide(), // Swipe right to go to the previous image
    preventDefaultTouchmoveEvent: true,
    trackMouse: true, // Allows mouse dragging as well
  });

  return (
    <div className="p-6">
      <div className="w-full max-w-[1650px] mx-auto relative overflow-hidden">
        <div className="relative w-full h-[400px]" {...handlers}>
          {/* Arrow Buttons */}
          <button
            className="absolute top-1/2 -translate-y-1/2 bg-black/50 text-white border-none p-2.5 cursor-pointer z-10 text-2xl rounded-full left-[10px]"
            onClick={() => {
              resetAutoSlide();
              prevSlide();
            }}
          >
            <ArrowLeft />
          </button>
          <button
            className="absolute top-1/2 -translate-y-1/2 bg-black/50 text-white border-none p-2.5 cursor-pointer z-10 text-2xl rounded-full right-[10px]"
            onClick={() => {
              resetAutoSlide();
              nextSlide();
            }}
          >
            <ArrowRight />
          </button>

          {/* Image and Overlay Content */}
          <div className="w-full h-full relative">
            <img
              src={images[currentIndex]}
              alt={`Slide ${currentIndex + 1}`}
              className="w-full h-full object-cover mt-20 rounded-md"
            />
            {/* Overlay Text and Button */}
            <div className="absolute top-[20%] left-[10%] bg-white p-5 rounded-[10px] max-w-[300px]">
              <h2 className="text-2xl mb-2.5 text-[#333]">
                SKILLS THAT DRIVE YOU FORWARD
              </h2>
              <p className="text-base mb-5 text-[#555]">
                Technology and the world of work change fast — with us, you’re
                faster. Get the skills to achieve goals and stay competitive.
              </p>
              <button
                onClick={() => navigate(`/courses`)}
                className="bg-[#6b48ff] text-white py-2.5 px-5 border-none rounded-[5px] cursor-pointer text-base hover:bg-[#5639cc]"
              >
                VIEW COURSES
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageSlider;
