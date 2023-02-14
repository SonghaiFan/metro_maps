import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

const buttonVariants = {
  hidden: {
    opacity: 0,
  },
  entry: {
    opacity: 1,
  },
};

const buttonPupVariants = {
  hidden: {
    x: 100,
    opacity: 0,
  },
  entry: {
    x: 0,
    opacity: 1,
  },
};

export default function NavigationButton({
  children,
  onClick,
  className,
  isVisible,
  isConfirmNeeded,
}) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleClick = () => {
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    setShowConfirm(false);
    onClick();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          className={`absolute bg-transparent rounded ${className}`}
          onClick={isConfirmNeeded ? handleClick : handleConfirm}
          variants={buttonVariants}
          initial="hidden"
          animate="entry"
          exit="hidden"
        >
          {children}
        </motion.button>
      )}
      {isVisible && showConfirm && (
        <motion.div
          key={"confirm"}
          className={`absolute top-[30%] right-2  p-5 bg-rose-800 rounded-lg shadow-lg`}
          variants={buttonPupVariants}
          initial="hidden"
          animate="entry"
        >
          <h1 className="mb-2 font-bold">
            Are you sure you want to proceed to next map?
          </h1>
          <h1 className="mb-2"> You can not come back anymore.</h1>
          <div className="flex items-center justify-between ">
            <button
              className="p-2 text-xl font-bold bg-rose-800 hover:bg-rose-900 rounded-lg"
              onClick={handleConfirm}
            >
              Yes
            </button>
            <button
              className="p-2 text-xl font-bold bg-rose-800 hover:bg-rose-900 rounded-lg"
              onClick={() => setShowConfirm(false)}
            >
              Not yet
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
