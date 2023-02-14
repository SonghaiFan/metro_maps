import React from "react";
import { motion } from "framer-motion";

// format time to human readable minutes and seconds
const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes} minutes and ${seconds} seconds`;
};

function MetroMapDescription({
  isDisplayed,
  description,
  idx,
  subtitle,
  hint,
  height,
  time,
}) {
  return (
    <>
      {isDisplayed && (
        <motion.div className="absolute top-[20%] left-[40%] w-[20%] h-[50%] p-5 bg-neutral-900 rounded-lg shadow-lg">
          <div className="flex flex-col h-full">
            <div className="text-2xl text-emerald-400 font-bold text-center h-1/6">
              Task: {idx + 1}
            </div>
            <div className="flex flex-col justify-center items-center h-4/6">
              <div className="text-lg">
                The time for this task is
                <span className="text-yellow-500 font-bold">
                  {" "}
                  {formatTime(time)}{" "}
                </span>
                . When you are on this screen, the timer will pause. Take a
                break! When you are ready to go, click{" "}
                <span className="text-yellow-500 font-bold">
                  anywhere or start
                </span>{" "}
                to enter task edit mode and start the timer.
              </div>
            </div>

            <div className="flex justify-center items-center h-1/6">
              <button>
                <div className="flex justify-center items-center w-32 h-10 bg-slate-500 hover:bg-slate-600 rounded-lg">
                  <div className="text-xl font-bold">Start</div>
                </div>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}

export default MetroMapDescription;
