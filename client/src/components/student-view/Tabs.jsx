import { Button } from "@/components/ui/button";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CommentAndDescriptionTabs = () => {
  const [activeTab, setActiveTab] = useState("description");

  return (
    <div className="w-full mx-auto p-4 text-black rounded-lg shadow-md">
      <div className="flex space-x-15 mb-4">
        <Button
          className="cursor-pointer"
          variant={activeTab === "description" ? "default" : "outline"}
          onClick={() => setActiveTab("description")}
        >
          Description
        </Button>

        <Button
          className="cursor-pointer"
          variant={activeTab === "comments" ? "default" : "outline"}
          onClick={() => setActiveTab("comments")}
        >
          Comments
        </Button>
      </div>

      <div className="relative h-40 overflow-hidden">
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
              <p className="text-sm">This is the description content.</p>
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
              <p className="text-sm">This is the comments section.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CommentAndDescriptionTabs;
