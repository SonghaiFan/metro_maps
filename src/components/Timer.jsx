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
  const [hasAlerted, setHasAlerted] = useState(false);

  const timeLeftPercent = timeLeft / pageState.time;
  const timeLeftPercentString = (timeLeftPercent * 100).toFixed(0) + "%";
  // const timeUsedPercentString = ((1 - timeLeftPercent) * 100).toFixed(0) + "%";

  function ease(x) {
    return x * x * x;
  }

  // console.log(ease(1 - timeLeftPercent));

  // console.log(`timeLeft: ${timeLeft}`);

  useEffect(() => {
    if (timeLeft === 0) {
      return onTimeUp();
    }

    if (!hasAlerted && isValid && timeLeftPercent === 0.9) {
      setHasAlerted(true);

      // alert("Time is closing!");
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
  }, [hasAlerted, isStop, isValid, onTimeUp, timeLeft, timeLeftPercent]);

  useEffect(() => {
    setTimeLeft(pageState.time);
  }, [pageState]);

  return (
    <AnimatePresence>
      {isValid && (
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
          <motion.div className="fixed w-2 h-full  rounded-full ">
            <motion.div
              className="bg-white break-normal w-2 text-black text-xs font-medium p-0.5 leading-none rounded-b-full"
              animate={{
                height: timeLeftPercentString,
                opacity: ease(1 - timeLeftPercent),
              }}
              transition={{ duration: 1, ease: "linear" }}
            ></motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
