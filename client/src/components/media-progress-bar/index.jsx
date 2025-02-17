import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const MediaProgressBar = ({ isMediaUploading, progress }) => {
  const [showProgress, setShowProgress] = useState(false);
  const [animatedProgress, setAnimatedProgress] = useState(false);

  useEffect(() => {
    if (isMediaUploading) {
      setShowProgress(true);
      setAnimatedProgress(progress);
    } else {
      const timer = setTimeout(() => {
        setShowProgress(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isMediaUploading, progress]);

  if (!showProgress) return null;

  return (
    <div className="w-full max-w-7xl bg-gray-200 rounded-full h-3 ml-5 mb-4 mt-4 relative overflow-hidden">
      <motion.div
        className="bg-blue-600 h-3 rounded-full"
        initial={{ width: 0 }}
        animate={{
          width: `${animatedProgress}%`,
          transition: { duration: 0.5, ease: "easeInOut" },
        }}
      >
        {progress >= 100 && isMediaUploading && (
          <motion.div
            className="absolute top-0 right-0 left-0 bottom-0 bg-blue-400"
            animate={{
              x: ["0%", "100%", "0%"],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        )}
      </motion.div>
    </div>
  );
};

export default MediaProgressBar;
