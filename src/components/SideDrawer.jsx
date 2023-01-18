import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { invertCustomerInterpolation } from "../utilities/util";
import { MdClose, MdCheck } from "react-icons/md";
import mixpanel from "mixpanel-browser";

export const SideDrawer = ({
  isVisible,
  close,
  screenWidth,
  screenHeight,
  whoOpenSideDrawer,
  handleSideDrawerConfirmed,
  handleChange,
}) => {
  const drawerWidth = screenWidth;
  const drawerHeight = screenHeight / 4;
  // check if whoOpenSideDrawer dom element is on top half of the screen

  const [isOnTopHalf, setIsOnTopHalf] = useState(false);

  useEffect(() => {
    setIsOnTopHalf(
      whoOpenSideDrawer
        ? whoOpenSideDrawer.getBoundingClientRect().top < screenHeight / 2
        : false
    );
  }, [whoOpenSideDrawer, screenHeight]);

  const getColour = (whoOpenSideDrawer) => {
    if (whoOpenSideDrawer) {
      const type = whoOpenSideDrawer.dataset.type;
      // console.log("type", type);
      if (type === "metro-line-path") {
        // return path element stroke properties

        return getComputedStyle(whoOpenSideDrawer).stroke;
      } else {
        return whoOpenSideDrawer.style.backgroundColor;
      }
    }
  };

  const whoColour = getColour(whoOpenSideDrawer);
  const whoValue = invertCustomerInterpolation(whoColour);

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          <motion.div
            className="drawer-modal absolute w-screen h-screen bg-black z-50"
            style={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            onClick={close}
            transition={{ duration: 0.2 }}
          />
          <motion.div
            className={
              isOnTopHalf
                ? `absolute bottom-0 right-[25%] flex items-center justify-center bg-neutral-900 rounded-2xl z-50`
                : `absolute top-0 right-[25%] flex items-center justify-center bg-neutral-900 rounded-2xl z-50`
            }
            style={{ width: drawerWidth / 2, overflow: "hidden" }}
            animate={{ height: drawerHeight }}
            exit={{ height: 0, capacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.button
              className="absolute top-0 right-0 flex justify-center items-center text-4xl"
              onClick={close}
            >
              <MdClose />
            </motion.button>

            <motion.div className="text-2xl mx-10">
              {/* range slider with five step, label is very high, high, moderate, weak, very weak */}
              <motion.h1 className="text-2xl">
                Please rate the degree of connection
              </motion.h1>
              <motion.input
                id="range-slider"
                type="range"
                className="w-full h-3 bg-gray-70 rounded-lg appearance-none cursor-pointer range-lg"
                min="0"
                max="1"
                step="0.25"
                defaultValue={whoValue}
                list="tickmarks"
                onChange={handleChange}
              />
              <motion.datalist id="tickmarks" className="felex flex-col ">
                <option>Very high</option>
                <option>High</option>
                <option>Moderate</option>
                <option>Weak</option>
                <option>Very weak</option>
              </motion.datalist>
              <motion.div className="w-full flex justify-between text-xs px-2">
                <span>|</span>
                <span>|</span>
                <span>|</span>
                <span>|</span>
                <span>|</span>
              </motion.div>
              <motion.div className="w-full flex justify-between text-xs px-2">
                <span>Very weak</span>
                <span>Weak</span>
                <span>Moderate</span>
                <span>High</span>
                <span>Very high</span>
              </motion.div>
              <br></br>
              <motion.button
                className="absolute bottom-0 right-0 flex justify-center items-center text-4xl"
                onClick={() => handleSideDrawerConfirmed(whoOpenSideDrawer)}
              >
                <MdCheck />
              </motion.button>
              <motion.h1 className="text-sm max-w-xl ">
                PS: Based on your reading, how relatively strong is the
                connection in this corpus? Either change it or leave it as it
                is. confirm your choice by clicking confrim button. Exit the
                side drawer by clicking the close button or anywhere outside the
                side drawer.
              </motion.h1>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
