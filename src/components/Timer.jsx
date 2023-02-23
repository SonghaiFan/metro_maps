import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdTimerOff, MdTimer } from "react-icons/md";

const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes}m ${seconds}s`;
};

export default function Timer({ pageState, isValid, isStop, onTimeUp }) {
  const timeToCount = pageState.time;
  const [timeLeft, setTimeLeft] = useState(timeToCount);

  const timeLeftPercent = timeLeft / pageState.time;

  useEffect(() => {
    if (timeLeft === 0) {
      return onTimeUp();
    }

    if (isStop) {
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000); // update timeLeft every second

    return () => {
      clearInterval(interval);
    }; // clear the interval when the component unmounts
  }, [isStop, isValid, onTimeUp, timeLeft, timeLeftPercent]);

  useEffect(() => {
    setTimeLeft(pageState.time);
  }, [pageState]);

  return (
    isValid && (
      <>
        <motion.div
          className={"fixed w-full h-2"}
          style={{
            color: timeLeftPercent < 0.2 ? "red" : "white",
            animation:
              timeLeftPercent < 0.2 && "alerts-blink 0.4s ease-out infinite",
          }}
        >
          {isStop ? (
            <div className="flex items-center justify-center align-items-center mt-1">
              <MdTimerOff size={30} />
              <span>{`Total Time: ${formatTime(timeLeft)}`}</span>
            </div>
          ) : (
            <div className="flex items-center justify-center align-items-center mt-1">
              <MdTimer size={30} />
              <span>{`Time Remaining: ${formatTime(timeLeft)}`}</span>
            </div>
          )}
        </motion.div>
      </>
    )
  );
}
