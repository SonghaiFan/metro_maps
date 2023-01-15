import React from "react";
import { motion } from "framer-motion";

function MetroMapDescription({
  isDisplayed,
  description,
  subtitle,
  hint,
  height,
  time,
}) {
  return (
    <>
      {isDisplayed && (
        <motion.div className="absolute top-[10%] left-[25%] w-[50%] h-[80%] p-5 bg-neutral-800 rounded-lg shadow-lg">
          <div className="flex  flex-col h-full">
            <div className="text-3xl flex justify-between items-center h-1/6">
              {hint}
            </div>
            <div className="flex flex-col justify-center items-center h-4/6">
              <div className="text-2xl font-bold">
                The time for this task is
                <span className="text-yellow-500"> {time} seconds</span>. When
                you are on this screen, the timer will pause. Take a break! When
                you are ready to go, click{" "}
                <span className="text-yellow-500">anywhere</span> to enter task
                edit mode and start the timer.
              </div>
            </div>

            <div className="flex justify-center items-center h-1/6">
              <div className="text-2xl font-bold">Start</div>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}

export default MetroMapDescription;
